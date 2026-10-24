#!/usr/bin/env python3
"""ترحيل دروس feat إلى مخطط main — إضافة فقط، بدون حذف.

السياق: مولّدات tools/gen أنتجت دروسًا بصيغة أحدث من مخطط main:
حقول جديدة (pedagogy/contentBlocks/levelCode/…) وحقول ناقصة مطلوبة
(mastery/unlock/programSlug/targetStructures/scoring). هذا السكربت
يسدّ النواقص بقيم مشتقة من الدرس نفسه أو من نمط الدروس القديمة،
ولا يحذف أي درس أو مفردة أو حقل — الإضافات فقط. توسيع المخطط
لقبول الحقول الجديدة يتم في ملفات content/schema/*.schema.json
(مراجعة منفصلة، وليست من هذا السكربت).

قواعد الاشتقاق (موثقة هنا حتى لا تُعامل كتخمين):
- mastery: minAccuracy=70 (نفس كل الدروس القديمة)،
  minCorrectExercises=ceil(عدد التمارين المقيمة/2) بحد أدنى 1،
  requiredExerciseTypes=أنواع التمارين الموجودة فعلًا في الدرس
  (فحص الـworker هو "النوع موجود في الدرس" فيمرّ بالبناء).
- unlock: {type: sequential} (نفس كل دروس المسار الأساسي القديمة).
- programSlug: من paths.json للمجلد — البرنامج الذي يضم الدرس.
- targetStructures: عناوين grammarPoints من pedagogy الخاص بالدرس،
  وإلا عناوين contentBlocks — كلها نصوص من الدرس نفسه، لا اختراع.
- scoring المفقود: all_or_nothing للتمارين المقيمة آليًا،
  وself_assessment لتمارين الإنتاج (بلا rubric مخترع).
- تمارين الإنتاج (speak/roleplay/phone/…) التي يطلب المدقق لها
  scoring.mode من نوع rubric ومعيارًا من بندين على الأقل: تُمنح
  معيارًا عامًا افتراضيًا من بندين (نطق/طلاقة، 50/50) — قالب
  عام موحد، وليس معايير خاصة بكل درس؛ الفريق يصقلها لاحقًا
  بمعايير نطق خاصة بكل نص.
- حالة خاصة: معرّف 'a1_hab_2_gender_salón' به تشكيل لاتيني
  ومرجعه مكتوب 'saló' (مرجع معلق لا يشير لشيء) — يُوحَّدان
  إلى ASCII 'a1_hab_2_gender_salon' في نفس الملف فقط.
  كلمة 'salón' في النصوص الإسبانية لا تُمس (الاستبدال بالمفتاح
  الكامل ذي البادئة فقط).
- حالة خاصة: تمرين ex-a2-pod-3 كان توجيهه instructionAr
  يحتوي نص الإجابة حرفيًا («los») فيكشفها — أُعيدت صياغة
  التوجيه إلى توجيه عام دون تغيير السؤال أو الخيارات.

السكربت idempotent: إعادة تشغيله لا تغيّر شيئًا.
"""

import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIRS = ["a1", "a2", "b1", "b2", "c1"]

# أنواع المشاركة لا تدخل في حساب الدقة لدى الـworker (grading.ts)
PARTICIPATION_TYPES = {
    "speak_with_text", "speak_free", "roleplay_simulation",
    "phone_call_response", "match_pairs",
}
# أنواع الإنتاج التي يطلب المدقق لها scoring من نوع rubric/self_assessment
RUBRIC_TYPES = {
    "speak_with_text", "speak_free", "roleplay_simulation",
    "phone_call_response", "resolve_customer_issue", "write_email",
}


def program_for(dirpath, slug):
    paths = json.loads((dirpath / "paths.json").read_text(encoding="utf-8"))
    for prog in paths["programs"]:
        for unit in prog["units"]:
            if slug in unit["lessons"]:
                return prog["slug"]
    return "main-track"


def derive_structures(lesson):
    ped = lesson.get("pedagogy") or {}
    titles = [
        g.get("titleAr")
        for g in ped.get("grammarPoints", [])
        if isinstance(g, dict) and g.get("titleAr")
    ]
    titles = [t for t in titles if isinstance(t, str) and len(t) >= 3]
    if titles:
        return titles
    blocks = lesson.get("contentBlocks") or []
    bt = [
        b.get("titleAr")
        for b in blocks
        if isinstance(b, dict) and b.get("titleAr")
    ]
    return [t for t in bt if isinstance(t, str) and len(t) >= 3]


def main():
    stats = {
        "files": 0, "mastery": 0, "unlock": 0, "programSlug": 0,
        "targetStructures": 0, "scoring": 0, "rubric": 0,
    }
    problems = []
    for d in DIRS:
        dirpath = ROOT / "content" / "drafts" / d
        for f in sorted(dirpath.glob("lesson-*.json")):
            doc = json.loads(f.read_text(encoding="utf-8"))
            lesson = doc["lesson"]
            changed = False
            if "mastery" not in lesson:
                graded = [
                    e for e in lesson["exercises"]
                    if e.get("type") not in PARTICIPATION_TYPES
                ]
                lesson["mastery"] = {
                    "minAccuracy": 70,
                    "minCorrectExercises": max(1, math.ceil(len(graded) / 2)) if graded else 1,
                    "requiredExerciseTypes": sorted(
                        {e["type"] for e in lesson["exercises"] if e.get("type")}
                    ),
                }
                changed = True
                stats["mastery"] += 1
            if "unlock" not in lesson:
                lesson["unlock"] = {"type": "sequential"}
                changed = True
                stats["unlock"] += 1
            if "programSlug" not in lesson:
                lesson["programSlug"] = program_for(dirpath, lesson["slug"])
                changed = True
                stats["programSlug"] += 1
            if "targetStructures" not in lesson:
                ts = derive_structures(lesson)
                if not ts:
                    problems.append(f"{f}: لا يمكن اشتقاق targetStructures")
                    continue
                lesson["targetStructures"] = ts
                changed = True
                stats["targetStructures"] += 1
            for e in lesson["exercises"]:
                if "scoring" not in e:
                    e["scoring"] = (
                        {"mode": "self_assessment"}
                        if e.get("type") in RUBRIC_TYPES
                        else {"mode": "all_or_nothing"}
                    )
                    changed = True
                    stats["scoring"] += 1
                # تمارين الإنتاج: المدقق يطلب mode من نوع rubric
                # ومعيارًا من بندين على الأقل (مجموع أوزانه 100)
                if e.get("type") in RUBRIC_TYPES:
                    sc = e.setdefault("scoring", {})
                    rubric = sc.get("rubric") or []
                    if sc.get("mode") not in ("rubric", "self_assessment") or len(rubric) < 2:
                        sc["mode"] = "rubric"
                        sc["rubric"] = [
                            {"code": "pronunciation", "labelAr": "النطق السليم والواضح", "weight": 50},
                            {"code": "fluency", "labelAr": "الطلاقة وإتمام الجملة", "weight": 50},
                        ]
                        changed = True
                        stats["rubric"] += 1
            if changed:
                f.write_text(
                    json.dumps(doc, ensure_ascii=False, indent=2),
                    encoding="utf-8",
                )
                stats["files"] += 1

    # حالة خاصة: توجيه يكشف الإجابة حرفيًا (ex-a2-pod-3)
    leak_file = ROOT / "content" / "drafts" / "a2" / "lesson-a2-pronombres-objeto-directo.json"
    doc = json.loads(leak_file.read_text(encoding="utf-8"))
    for e in doc["lesson"]["exercises"]:
        if e["id"] == "ex-a2-pod-3" and "los" in e.get("instructionAr", ""):
            e["instructionAr"] = "حدد الضمير المناسب ليحل محل الاسم في الجملة"
            leak_file.write_text(
                json.dumps(doc, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            stats["leak_fix"] = True

    # حالة خاصة: معرّف به تشكيل ومرجع معلق (نفس الملف فقط)
    hab = ROOT / "content" / "drafts" / "a1" / "lesson-a1-habitaciones.json"
    txt = hab.read_text(encoding="utf-8")
    if "a1_hab_2_gender_salón" in txt or "a1_hab_2_gender_saló" in txt:
        txt = txt.replace(
            "a1_hab_2_gender_salón", "a1_hab_2_gender_salon"
        ).replace(
            "a1_hab_2_gender_saló", "a1_hab_2_gender_salon"
        )
        hab.write_text(txt, encoding="utf-8")
        stats["salo_fix"] = True

    print(json.dumps(stats, ensure_ascii=False, indent=2))
    if problems:
        print("PROBLEMS:")
        for p in problems:
            print(" -", p)
        sys.exit(1)


if __name__ == "__main__":
    main()
