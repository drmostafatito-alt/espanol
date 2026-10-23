# -*- coding: utf-8 -*-
"""
tools/books/inventory.py — جرد وتوثيق الكتب والمصادر الإسبانية المتاحة
"""
import os
import sys
import json
import pypdf

BOOKS_DIR = r"c:\Users\tito\Desktop\كتب ومصادر اسبانية"
OUTPUT_MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "reports", "books-manifest.json")

def inspect_books():
    manifest = {
        "sourceDir": BOOKS_DIR,
        "totalFiles": 0,
        "totalPdfs": 0,
        "totalAudio": 0,
        "books": []
    }

    if not os.path.exists(BOOKS_DIR):
        print(f"Error: {BOOKS_DIR} does not exist!")
        return manifest

    for root, dirs, files in os.walk(BOOKS_DIR):
        for f in sorted(files):
            manifest["totalFiles"] += 1
            ext = os.path.splitext(f)[1].lower()
            if ext == ".mp3":
                manifest["totalAudio"] += 1
                continue
            if ext != ".pdf" or f.startswith("._"):
                continue

            manifest["totalPdfs"] += 1
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, BOOKS_DIR)
            file_size_mb = round(os.path.getsize(full_path) / (1024 * 1024), 2)

            info = {
                "relativePath": rel_path,
                "fileName": f,
                "sizeMb": file_size_mb,
                "pageCount": 0,
                "textExtractable": False,
                "sampleTextLength": 0,
                "series": "other",
                "targetLevel": "unknown"
            }

            # التصنيف حسب السلسلة
            lower_rel = rel_path.lower()
            if "aula plus" in lower_rel:
                info["series"] = "Aula Plus"
                if "1 (a1)" in lower_rel: info["targetLevel"] = "A1"
                elif "2 (a2)" in lower_rel: info["targetLevel"] = "A2"
                elif "3 (b1.1)" in lower_rel: info["targetLevel"] = "B1.1"
                elif "4 (b1.2)" in lower_rel: info["targetLevel"] = "B1.2"
                elif "5 (b2.1)" in lower_rel: info["targetLevel"] = "B2.1"
                elif "6 (b2.2)" in lower_rel: info["targetLevel"] = "B2.2"
                elif "7 (c1)" in lower_rel: info["targetLevel"] = "C1"
            elif "aula internacional" in lower_rel:
                info["series"] = "Aula Internacional"
                if "aula 1" in lower_rel: info["targetLevel"] = "A1"
                elif "aula 2" in lower_rel: info["targetLevel"] = "A2"
                elif "aula 3" in lower_rel: info["targetLevel"] = "B1"
                elif "aula 4" in lower_rel: info["targetLevel"] = "B1+"
                elif "aula 5" in lower_rel: info["targetLevel"] = "B2.1"
                elif "aula 6" in lower_rel: info["targetLevel"] = "B2.2"
            elif "sueña" in lower_rel or "suena" in lower_rel:
                info["series"] = "Sueña"
                if "sueña 1" in lower_rel: info["targetLevel"] = "A1-A2"
                elif "sueña 2" in lower_rel: info["targetLevel"] = "B1"
                elif "sueña 3" in lower_rel: info["targetLevel"] = "B2"
            elif "vocabulario" in lower_rel:
                info["series"] = "En Vocabulario"
                if "elemental" in lower_rel: info["targetLevel"] = "A1-A2"
                elif "medio" in lower_rel: info["targetLevel"] = "B1"

            try:
                reader = pypdf.PdfReader(full_path)
                pages = len(reader.pages)
                info["pageCount"] = pages
                sample_indices = [min(i, pages - 1) for i in [5, 10, 20, 30, 50] if i < pages]
                sample_lens = [len(reader.pages[i].extract_text() or "") for i in sample_indices]
                total_sample = sum(sample_lens)
                info["sampleTextLength"] = total_sample
                info["textExtractable"] = total_sample > 100
            except Exception as ex:
                info["error"] = str(ex)

            manifest["books"].append(info)

    os.makedirs(os.path.dirname(OUTPUT_MANIFEST), exist_ok=True)
    with open(OUTPUT_MANIFEST, "w", encoding="utf-8") as out:
        json.dump(manifest, out, ensure_ascii=False, indent=2)

    print(f"Manifest written: {OUTPUT_MANIFEST}")
    print(f"Total PDFs: {manifest['totalPdfs']}, Total Audio Tracks: {manifest['totalAudio']}")
    text_count = sum(1 for b in manifest['books'] if b['textExtractable'])
    print(f"Books with directly extractable text layer: {text_count} of {manifest['totalPdfs']}")
    for b in manifest["books"]:
        status = "✓ Text" if b["textExtractable"] else "Scanned"
        print(f"  [{status:7}] {b['series']:18} {b['targetLevel']:6} : {b['fileName']} ({b['pageCount']} pgs)")

if __name__ == "__main__":
    inspect_books()
