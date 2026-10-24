# -*- coding: utf-8 -*-
"""
tools/books/reconciler.py — مقارنة وفرز المعارف المستخرجة من الكتب مقابل المعجم والمنهج الحالي
"""
import os
import sys
import json
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, "tools", "gen", "lexicon"))
from builder_engine import get_existing_norms, norm_vocab

EXTRACTED_DIR = os.path.join(ROOT, "tools", "books", "extracted")
REPORTS_DIR = os.path.join(ROOT, "reports")

def reconcile_extracted_knowledge():
    existing = get_existing_norms()
    print(f"Current verified unique lexicon entries: {len(existing)}")

    # تحميل المفردات المستخرجة
    en_vocab_file = os.path.join(EXTRACTED_DIR, "en_vocabulario_b1.json")
    aula_vocab_file = os.path.join(EXTRACTED_DIR, "aula_plus_vocab.json")

    candidates = []
    if os.path.exists(en_vocab_file):
        with open(en_vocab_file, "r", encoding="utf-8") as f:
            candidates.extend(json.load(f))
    if os.path.exists(aula_vocab_file):
        with open(aula_vocab_file, "r", encoding="utf-8") as f:
            candidates.extend(json.load(f))

    print(f"Total extracted candidates to evaluate: {len(candidates)}")

    classified = {
        "ALREADY_COVERED": [],
        "ENRICH_EXISTING": [],
        "NEW_ENTRY": [],
        "REJECT_DUPLICATE": []
    }

    seen_norms = set()

    for item in candidates:
        hw = item.get("headword", "").strip()
        if not hw or len(hw) < 2:
            continue
        norm = norm_vocab(hw)
        if norm in seen_norms:
            classified["REJECT_DUPLICATE"].append({"headword": hw, "norm": norm})
            continue
        seen_norms.add(norm)

        if norm in existing:
            # موجود بالفعل: هل يقدم الكتاب معلومات إثرائية جديدة؟ (شرح/سياق)
            desc = item.get("desc", "")
            if desc and len(desc) > 5:
                classified["ENRICH_EXISTING"].append(item)
            else:
                classified["ALREADY_COVERED"].append(hw)
        else:
            classified["NEW_ENTRY"].append(item)

    print("Reconciliation results:")
    print(f"  ALREADY_COVERED: {len(classified['ALREADY_COVERED'])}")
    print(f"  ENRICH_EXISTING: {len(classified['ENRICH_EXISTING'])}")
    print(f"  NEW_ENTRY: {len(classified['NEW_ENTRY'])}")
    print(f"  REJECT_DUPLICATE: {len(classified['REJECT_DUPLICATE'])}")

    report_path = os.path.join(REPORTS_DIR, "books-reconciliation.json")
    with open(report_path, "w", encoding="utf-8") as out:
        json.dump({
            "existingCount": len(existing),
            "totalEvaluated": len(candidates),
            "summary": {k: len(v) for k, v in classified.items()},
            "enrichCandidates": classified["ENRICH_EXISTING"][:50],
            "newEntrySamples": classified["NEW_ENTRY"][:50]
        }, out, ensure_ascii=False, indent=2)

    print(f"Saved reconciliation report: {report_path}")
    return classified

if __name__ == "__main__":
    reconcile_extracted_knowledge()
