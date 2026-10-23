# -*- coding: utf-8 -*-
"""
tools/books/extractor.py — استخراج المعارف اللغوية وقوائم المفردات والشروح من كتب المصادر
"""
import os
import sys
import re
import json
import pypdf

BOOKS_DIR = r"c:\Users\tito\Desktop\كتب ومصادر اسبانية"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "extracted")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_vocabulario_b1():
    """استخراج المعجم والقواعد من كتاب En Vocabulario Nivel Medio B1"""
    pdf_path = os.path.join(BOOKS_DIR, "Vocabulario en Español", "En Vocabulario_ Nivel medio B1.pdf")
    if not os.path.exists(pdf_path):
        print(f"Not found: {pdf_path}")
        return []

    print(f"Reading {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    extracted_entries = []
    
    # استخراج الكلمات والتعابير من صفحات الوحدات
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if not text:
            continue
        
        # البحث عن أنماط الرؤوس المعجمية والتعريفات
        # مثال: 1. el / la ... أو اسم متبوع بـ m. / f. / adj.
        lines = text.split("\n")
        for line in lines:
            line_str = line.strip()
            # فحص إن كانت الكلمة تبدأ بمحدد جنسية أو صفة
            match = re.match(r"^([a-záéíóúñA-ZÁÉÍÓÚÑ\s]{3,35})\s*\((m|f|adj|v|adv)\.\)\s*(.*)", line_str)
            if match:
                hw, pos_tag, desc = match.groups()
                hw = hw.strip().lower()
                extracted_entries.append({
                    "headword": hw,
                    "pos": "noun" if pos_tag in ("m", "f") else "adj" if pos_tag == "adj" else "verb" if pos_tag == "v" else "adv",
                    "gender": pos_tag if pos_tag in ("m", "f") else None,
                    "source": "En Vocabulario B1",
                    "page": idx + 1,
                    "desc": desc.strip()
                })
    
    out_file = os.path.join(OUTPUT_DIR, "en_vocabulario_b1.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(extracted_entries, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(extracted_entries)} candidates from En Vocabulario B1 -> {out_file}")
    return extracted_entries

def extract_aula_plus_glossaries():
    """استخراج المفردات والتراكيب من سلسلة Aula Plus"""
    folder = os.path.join(BOOKS_DIR, "كتاب Aula Plus")
    if not os.path.exists(folder):
        return []

    all_vocab = []
    for f in sorted(os.listdir(folder)):
        if not f.lower().endswith(".pdf"):
            continue
        p = os.path.join(folder, f)
        print(f"Extracting syllabus & lexicon from {f}...")
        try:
            reader = pypdf.PdfReader(p)
            for idx, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                # البحث عن أقسام LÉXICO أو RECURSOS LÉXICOS
                if "LÉXICO" in text or "RECURSOS LÉXICOS" in text:
                    lines = text.split("\n")
                    for l in lines:
                        clean = l.strip()
                        # التقاط الكلمات المفتاحية
                        if clean and len(clean) > 3 and not clean.startswith("LÉXICO") and not clean.startswith("RECURSOS"):
                            parts = clean.split("•")
                            for part in parts:
                                w = part.strip()
                                if 3 <= len(w) <= 30 and re.match(r"^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$", w):
                                    all_vocab.append({
                                        "headword": w.lower(),
                                        "source": f,
                                        "page": idx + 1
                                    })
        except Exception as ex:
            print(f"Error on {f}: {ex}")

    out_file = os.path.join(OUTPUT_DIR, "aula_plus_vocab.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_vocab, f, ensure_ascii=False, indent=2)
    print(f"Extracted {len(all_vocab)} vocabulary mentions from Aula Plus -> {out_file}")
    return all_vocab

if __name__ == "__main__":
    extract_vocabulario_b1()
    extract_aula_plus_glossaries()
