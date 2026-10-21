# -*- coding: utf-8 -*-
"""
extend_verb_forms.py — يكمل تصريفات الأفعال الموجودة في كل حزم content/drafts/**/vocab-*.json

القاعدة: لا يلمس الأشكال الموجودة إطلاقًا — يضيف فقط الأزمنة/الأشكال الناقصة
(pretérito، imperfecto، futuro، condicional، subjuntivo، gerund، participle)
من محرّك morphology. الفعل الانعكاسي (…se) يُصرف مع الضمائر.

الاستخدام: python3 tools/gen/lexicon/extend_verb_forms.py [--dry-run]
"""
from __future__ import annotations
import json
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from morphology import conjugate  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
REFL_PRON = {"1s": "me", "2s": "te", "3s": "se", "1p": "nos", "2p": "os", "3p": "se"}
DRY = "--dry-run" in sys.argv


def key_of(f):
    return (f.get("kind"), f.get("tense"), f.get("person"), f.get("mood"))


def main() -> int:
    changed_files = added = 0
    for path in sorted(glob.glob(os.path.join(ROOT, "content", "drafts", "**", "vocab-*.json"), recursive=True)):
        doc = json.load(open(path, encoding="utf-8"))
        changed = False
        for e in doc.get("entries", []):
            if e.get("pos") != "verb":
                continue
            lemma = e["normalized"]
            try:
                if lemma.endswith("se"):
                    forms = conjugate(lemma[:-2])
                    for f in forms:
                        if f["kind"] == "conjugation":
                            f["formEs"] = f'{REFL_PRON[f["person"]]} {f["formEs"]}'
                else:
                    forms = conjugate(lemma)
            except ValueError:
                continue
            have = {key_of(f) for f in (e.get("forms") or [])}
            missing = [f for f in forms if key_of(f) not in have]
            if missing:
                e["forms"] = (e.get("forms") or []) + missing
                added += len(missing)
                changed = True
        if changed:
            changed_files += 1
            if not DRY:
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(doc, f, ensure_ascii=False, indent=1)
                    f.write("\n")
            print(f"  {'[dry] ' if DRY else '✓ '}{os.path.relpath(path, ROOT)}")
    print(f"ملفات معدّلة: {changed_files} — أشكال مضافة: {added}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
