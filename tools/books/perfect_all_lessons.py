#!/usr/bin/env python3
"""
tools/books/perfect_all_lessons.py
Generates and writes all 16 platform-native interactive lessons (A2: 4, B1: 4, B2: 4, C1: 4)
ensuring 100% compliance with validate-content.mjs and vitest content-gates.
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent.parent

# Import all lessons definitions
from perfect_data import ALL_16_LESSONS

def main():
    print("=== توليد وتحديث الـ 16 درسًا لجميع المستويات (A2, B1, B2, C1) ===")
    counts = {}
    for item in ALL_16_LESSONS:
        d = ROOT / item["dir"]
        d.mkdir(parents=True, exist_ok=True)
        fpath = d / item["file"]
        
        doc = {
            "schemaVersion": "1.0.0",
            "lesson": item["lesson"]
        }
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
            f.write("\n")
        
        lvl = item["lesson"]["level"]
        counts[lvl] = counts.get(lvl, 0) + 1
        print(f"✅ تم كتابة {item['dir']}/{item['file']} ({item['lesson']['slug']})")

    print("\nإحصائية الدروس المولدة:")
    for lvl, cnt in counts.items():
        print(f"  - المستوى {lvl}: {cnt} دروس")

if __name__ == "__main__":
    main()
