#!/usr/bin/env python3
"""tools/fix-verb-forms.py — تصحيح تصريفات الأفعال المخزّنة في حزم المفردات.

يقرأ قائمة المخالفات من reports/audit/verb-forms.json (مخرَج tools/audit-verb-forms.mjs)،
ثم يعيد توليد حقل `forms` لتلك الأفعال من tools/gen/lexicon/morphology.py (المصدر الوحيد
للتصريف)، فيحدث السلوك المرجو دون لمس أي حقل آخر (المعاني، الأمثلة، الترجمات، المعرفات).

الاستخدام:
  python tools/fix-verb-forms.py            # يطبّق التصحيح
  python tools/fix-verb-forms.py --dry-run  # يعرض ما سيتغير بلا كتابة
"""
import json
import sys
from pathlib import Path

# وحدة التحكم على Windows قد تكون cp1252: بلا هذا السطر يفشل الإخراج العربي
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools/gen/lexicon"))
from morphology import conjugate  # noqa: E402

REPORT = ROOT / "reports/audit/verb-forms.json"
CONTENT = ROOT / "content/drafts"


def load_affected() -> set[str]:
    if not REPORT.exists():
        raise SystemExit("شغّل أولًا: node tools/audit-verb-forms.mjs --json reports/audit/verb-forms.json")
    data = json.loads(REPORT.read_text(encoding="utf-8"))
    return {v["headword"] for v in data["violations"]}


def main() -> int:
    dry = "--dry-run" in sys.argv
    affected = load_affected()
    if not affected:
        print("لا مخالفات — لا شيء للتصحيح.")
        return 0

    changed_files = 0
    changed_entries = 0
    changed_forms = 0
    for path in sorted(CONTENT.rglob("vocab-*.json")):
        raw = path.read_text(encoding="utf-8")
        pack = json.loads(raw)
        dirty = False
        for entry in pack.get("entries", []):
            lemma = entry.get("headword")
            if lemma not in affected or not entry.get("forms"):
                continue
            fresh = conjugate(lemma)
            before = {(f.get("kind"), f.get("tense"), f.get("person")): f.get("formEs") for f in entry["forms"]}
            after = {(f["kind"], f["tense"], f["person"]): f["formEs"] for f in fresh}
            diffs = [(k, before.get(k), after.get(k)) for k in after if before.get(k) != after.get(k)]
            if not diffs:
                continue
            changed_entries += 1
            changed_forms += len(diffs)
            print(f"{path.relative_to(ROOT)} · {lemma}")
            for (kind, tense, person), old, new in diffs:
                print(f"    {tense or kind} {person or ''}: {old} → {new}")
            if not dry:
                entry["forms"] = fresh
                dirty = True
        if dirty:
            path.write_text(json.dumps(pack, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
            changed_files += 1

    print(f"\n{'[dry-run] ' if dry else ''}ملفات: {changed_files} · مداخل: {changed_entries} · صيغ: {changed_forms}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
