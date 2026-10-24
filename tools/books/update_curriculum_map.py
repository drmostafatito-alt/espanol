#!/usr/bin/env python3
"""
tools/books/update_curriculum_map.py
Updates content/curriculum/curriculum-map.v1.json to register the 16 new lessons across A2, B1, B2, and C1.
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent.parent
MAP_PATH = ROOT / "content/curriculum/curriculum-map.v1.json"

with open(MAP_PATH, "r", encoding="utf-8") as f:
    cmap = json.load(f)

main_track = next(t for t in cmap["tracks"] if t["slug"] == "main-track")

# 1. A2 - a2-u2-past
a2_lvl = next(l for l in main_track["levels"] if l["levelCode"] == "A2")
a2_u2 = next(u for u in a2_lvl["units"] if u["slug"] == "a2-u2-past")
a2_u2["lessons"] = [
    {
        "slug": "a2-indefinido-regular",
        "titleAr": "الماضي البسيط: تصريف الأفعال المنتظمة",
        "objectiveAr": "أن يصرّف المتعلم أفعال المجموعات الثلاث (-ar, -er, -ir) في الماضي البسيط (Indefinido) مع ضمائر الفاعل المختلفة، ويستخدم الظروف الزمنية الدالة على الماضي المنتهي بدقة.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "A2",
        "filePath": "content/drafts/a2/lesson-a2-indefinido-regular.json",
        "requires": []
    },
    {
        "slug": "a2-indefinido-irregular",
        "titleAr": "الماضي البسيط: الأفعال الشاذة الأساسية",
        "objectiveAr": "أن يتقن المتعلم تصريف واستخدام الأفعال الشاذة الرئيسية في الماضي البسيط: ser/ir (fui), estar (estuve), hacer (hice/hizo), tener (tuve)، ويميز بين ser و ir من سياق الجملة.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "A2",
        "filePath": "content/drafts/a2/lesson-a2-indefinido-irregular.json",
        "requires": ["a2-indefinido-regular"]
    },
    {
        "slug": "a2-imperfecto-habitos",
        "titleAr": "الماضي المستمر: العادات السابقة والوصف",
        "objectiveAr": "أن يستخدم المتعلم زمن الماضي المستمر (Pretérito Imperfecto) لوصف العادات والروتين اليومي في الماضي والوصف الحركي والمكاني، ويصرّف الأفعال الشاذة الثلاثة (ser, ir, ver).",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "A2",
        "filePath": "content/drafts/a2/lesson-a2-imperfecto-habitos.json",
        "requires": ["a2-indefinido-irregular"]
    },
    {
        "slug": "a2-indefinido-vs-imperfecto",
        "titleAr": "التفريق الحاسم في الماضي: Indefinido مقابل Imperfecto",
        "objectiveAr": "أن يفرّق المتعلم بين استخدام الماضي البسيط (Indefinido) للوقائع القاطعة والماضي المستمر (Imperfecto) للخلفية والوصف والأنشطة المتزامنة، ويستخدمهما معًا في جملة مركبة واحدة بنجاح.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "A2",
        "filePath": "content/drafts/a2/lesson-a2-indefinido-vs-imperfecto.json",
        "requires": ["a2-imperfecto-habitos"]
    }
]

# 2. B1 - b1-u2-opinions
b1_lvl = next(l for l in main_track["levels"] if l["levelCode"] == "B1")
b1_u2 = next(u for u in b1_lvl["units"] if u["slug"] == "b1-u2-opinions")
b1_u2["lessons"] = [
    {
        "slug": "b1-expresar-opinion-creo-que",
        "titleAr": "إبداء الرأي والشك: Creo que مقابل No creo que",
        "objectiveAr": "أن يتقن المتعلم التعبير عن الرأي واليقين باستخدام صيغة الإثبات (Creo que + Indicativo) والتعبير عن الشك والإنكار بصيغة النفي (No creo que + Subjuntivo) بدقة لغوية عالية.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B1",
        "filePath": "content/drafts/b1/lesson-b1-expresar-opinion-creo-que.json",
        "requires": []
    },
    {
        "slug": "b1-subjuntivo-deseos",
        "titleAr": "المضارع المنصوب: التعبير عن الرغبات والأمنيات",
        "objectiveAr": "أن يصيغ المتعلم صيغة المضارع المنصوب (Presente de Subjuntivo) لأفعال المجموعات الثلاث والشواذ، ويستخدمه في التعبير عن الرغبات والأمنيات مع التراكيب: Quiero que, Ojalá, Espero que.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B1",
        "filePath": "content/drafts/b1/lesson-b1-subjuntivo-deseos.json",
        "requires": ["b1-expresar-opinion-creo-que"]
    },
    {
        "slug": "b1-por-vs-para",
        "titleAr": "التمييز القاطع بين Por و Para للمتعلم العربي",
        "objectiveAr": "أن يفرّق المتعلم بدقة تامة بين حرفي الجر Por و Para في جميع سياقات الاستخدام (السبب والدافع مقابل الهدف والغاية، والمدة مقابل الموعد النهائي، والواسطة مقابل المستقبل).",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B1",
        "filePath": "content/drafts/b1/lesson-b1-por-vs-para.json",
        "requires": ["b1-subjuntivo-deseos"]
    },
    {
        "slug": "b1-acuerdo-desacuerdo",
        "titleAr": "التعبير عن الاتفاق والاختلاف والتفاوض",
        "objectiveAr": "أن يعبّر المتعلم عن الاتفاق الكامل أو الجزئي والاختلاف المهذب في النقاشات الرسمية والاجتماعية باستخدام تعبيرات: Estoy de acuerdo, Tienes razón, No lo veo así, Por una parte... por otra.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B1",
        "filePath": "content/drafts/b1/lesson-b1-acuerdo-desacuerdo.json",
        "requires": ["b1-por-vs-para"]
    }
]

# 3. B2 - b2-u1-argument
b2_lvl = next(l for l in main_track["levels"] if l["levelCode"] == "B2")
b2_u1 = next(u for u in b2_lvl["units"] if u["slug"] == "b2-u1-argument")
b2_u1["lessons"] = [
    {
        "slug": "b2-condicional-imperfecto-subjuntivo",
        "titleAr": "الجمل الشرطية الافتراضية: Si + Imperfecto de Subjuntivo",
        "objectiveAr": "أن يتقن المتعلم صياغة واستخدام الجمل الشرطية الافتراضية غير المتحققة في الحاضر (المقابلة لأداة «لو» الامتناعية في العربية) بتركيب: Si + Imperfecto de Subjuntivo -> Condicional Simple.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B2",
        "filePath": "content/drafts/b2/lesson-b2-condicional-imperfecto-subjuntivo.json",
        "requires": []
    },
    {
        "slug": "b2-conectores-argumentativos",
        "titleAr": "روابط الخطاب والمحاجة: Sin embargo و No obstante",
        "objectiveAr": "أن يستخدم المتعلم الروابط الحجاجية المتقدمة (Sin embargo, No obstante, En cambio, Por lo tanto, A pesar de que) لتنظيم الأفكار المعقدة والرد على الحجج المضادة في مقال أو نقاش أكاديمي ومهني.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B2",
        "filePath": "content/drafts/b2/lesson-b2-conectores-argumentativos.json",
        "requires": ["b2-condicional-imperfecto-subjuntivo"]
    },
    {
        "slug": "b2-matizar-opiniones",
        "titleAr": "تعديل الرأي والتحفظ الدبلوماسي: Matizar opiniones",
        "objectiveAr": "أن يستخدم المتعلم أساليب تعديل الرأي والتحفظ الدبلوماسي (Hasta cierto punto, En parte es verdad, Cabría añadir) لتجنب القطع الجازم في النقاشات الفكرية والمهنية الرفيعة.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B2",
        "filePath": "content/drafts/b2/lesson-b2-matizar-opiniones.json",
        "requires": ["b2-conectores-argumentativos"]
    },
    {
        "slug": "b2-contraargumentacion",
        "titleAr": "فن الرد والاعتراض المقنع: La Contraargumentación",
        "objectiveAr": "أن يبني المتعلم حجة مضادة مقنعة باستخدام تقنية التسليم الجزئي للخصم ثم الرد الحاسم (Si bien es cierto que... no obstante / Es verdad que... pero) في الحوارات والمقالات الجدلية.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "B2",
        "filePath": "content/drafts/b2/lesson-b2-contraargumentacion.json",
        "requires": ["b2-matizar-opiniones"]
    }
]

# 4. C1 - c1-u1-style
c1_lvl = next(l for l in main_track["levels"] if l["levelCode"] == "C1")
c1_u1 = next(u for u in c1_lvl["units"] if u["slug"] == "c1-u1-style")
c1_u1["lessons"] = [
    {
        "slug": "c1-precision-estilistica",
        "titleAr": "الدقة الأسلوبية: اختيار الأفعال النوعية بدل الأفعال العامة",
        "objectiveAr": "أن يستبدل المتعلم الأفعال العامة الخالية من الدلالة الدقيقة (مثل hacer, tener, decir, poner) بأفعال فصيحة نوعية تعبر عن المقصد بدقة بالغة في السياقات الأكاديمية والمهنية الرفيعة.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "C1",
        "filePath": "content/drafts/c1/lesson-c1-precision-estilistica.json",
        "requires": []
    },
    {
        "slug": "c1-nominalizacion",
        "titleAr": "التكثيف الأسلوبي: البناء بالمصادر والأسماء (La Nominalización)",
        "objectiveAr": "أن يتقن المتعلم تقنية التكثيف الأسلوبي عبر تحويل التراكيب الفعلية الطويلة إلى مصادر وأسماء نوعية (Nominalización) لرفع الكثافة المعجمية ورصانة النص في الكتابة الأكاديمية والرسمية.",
        "skills": ["grammar", "reading", "writing", "listening", "vocabulary"],
        "status": "authored",
        "levelCode": "C1",
        "filePath": "content/drafts/c1/lesson-c1-nominalizacion.json",
        "requires": ["c1-precision-estilistica"]
    },
    {
        "slug": "c1-refranes-modismos",
        "titleAr": "التعبيرات الاصطلاحية والأمثال في السياق الحي",
        "objectiveAr": "أن يفهم المتعلم ويوظف أشهر الأمثال والتعبيرات المجازية الإسبانية الأصيلة (Estar en las nubes, No tener pelos en la lengua, Dar en el clavo, Tomar el pelo) مع إدراك مقابلاتها الثقافية في العربية.",
        "skills": ["reading", "listening", "vocabulary", "speaking"],
        "status": "authored",
        "levelCode": "C1",
        "filePath": "content/drafts/c1/lesson-c1-refranes-modismos.json",
        "requires": ["c1-nominalizacion"]
    },
    {
        "slug": "c1-correspondencia-formal",
        "titleAr": "المراسلات الرسمية والبروتوكول الأكاديمي والمهني",
        "objectiveAr": "أن يحرر المتعلم خطابًا رسميًا أو بريدًا إلكترونيًا أكاديميًا متقنًا مستخدمًا ديباجات الافتتاح الرسمية وصيغ الطلب المهذب وخواتيم الاحترام والتقدير البروتوكولية المتعارف عليها في إسبانيا وأمريكا اللاتينية.",
        "skills": ["writing", "reading", "grammar", "vocabulary"],
        "status": "authored",
        "levelCode": "C1",
        "filePath": "content/drafts/c1/lesson-c1-correspondencia-formal.json",
        "requires": ["c1-refranes-modismos"]
    }
]

# 5. Update coverage section
cmap["coverage"]["authoredLessonFiles"] = 32  # 16 previous + 16 new
cmap["coverage"]["byTrack"]["main-track"]["authoredLessons"] = 21  # 5 previous + 16 new
cmap["coverage"]["byTrack"]["main-track"]["unitsWithContent"] = 6  # prea1-u4, a1-u1, a2-u2, b1-u2, b2-u1, c1-u1
cmap["coverage"]["totals"]["authoredLessons"] = 33  # 17 previous + 16 new

with open(MAP_PATH, "w", encoding="utf-8") as f:
    json.dump(cmap, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("✅ تم تحديث خريطة المنهج (content/curriculum/curriculum-map.v1.json) بنجاح.")
