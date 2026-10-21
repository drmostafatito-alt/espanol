# -*- coding: utf-8 -*-
"""
build.py — مولّد حزم المفردات من بيانات بذور منظمة (TSV)

المسار: seeds/*.tsv → تحقق من التكرار → morphology (تصريفات/IPA/جمع) →
content/drafts/core-vocab/vocab-*.json

قواعد صارمة:
  - لا إعادة تعريف: أي headword موجود في أي حزمة (أو مكرر داخل البذور) = فشل.
  - كل مدخل: معنى فصيح + مصري + مثال إسباني يحتوي المدخل + مثال عربي.
  - الأفعال: تصريفات كاملة من morphology.conjugate().
  - التكرار المقصود: انظر tools/count-lexicon.mjs.

صيغة TSV (بدون رأس):
  verbs:   lemma \t paradigm \t level \t msa \t eg \t ex_es \t ex_ar \t domain [\t usage_note]
  lexicon: head \t pos \t gender \t level \t msa \t eg \t ex_es \t ex_ar \t domain [\t kind]

الاستخدام: python3 tools/gen/lexicon/build.py [--only verbs nouns ...]
"""
from __future__ import annotations
import json
import os
import sys
import glob
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from morphology import conjugate, ipa_es, hint_ar, noun_plural  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SEEDS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seeds")
OUT_DIR = os.path.join(ROOT, "content", "drafts", "core-vocab")
BATCH_TAG = "lexicon-batch:b1-core"

PRON_NOTE = ("النقل بالحروف العربية تقريب فقط ولا يُعتمد للنطق الدقيق. راعِ أن h صامتة، "
             "وج قريبة من الخاء قبل e/i، وñ = نْي، وc/z قبل e/i تُنطق «ث» في إسبانيا و«س» في أمريكا اللاتينية.")
RANK_NOTE = ("الترتيب internalRank داخلي لسَلسَلة التدريس فقط. لا نسمّي هذه الحزم «الأكثر شيوعًا» "
             "قبل اعتماد قائمة تكرار مرخَّصة. IPA تلقائي تقريبي من قواعد الإملاء (إسبانية أوروبية) "
             "وينتظر مراجعة بشرية. الحزم مُولَّدة من tools/gen/lexicon/ (بذور TSV قابلة للمراجعة).")


def norm_vocab(s: str) -> str:
    out = s.lower()
    for ch in "¿?¡!.,;:\"'«»()…":
        out = out.replace(ch, "")
    return " ".join(out.split())


def load_tsv(path: str) -> list[list[str]]:
    rows = []
    with open(path, encoding="utf-8") as f:
        for ln, line in enumerate(f, 1):
            line = line.rstrip("\n")
            if not line.strip() or line.startswith("#"):
                continue
            rows.append(line.split("\t"))
    return rows


MANAGED = {"cv-lex-verbs-core", "cv-lex-nouns-core", "cv-lex-adjectives", "cv-lex-adverbs", "cv-lex-expressions"}


def existing_norms() -> dict[str, str]:
    """كل المداخل المعرَّفة مسبقًا — عدا الحزم التي يديرها هذا المولّد (تُعاد كتابتها)."""
    seen = {}
    for f in glob.glob(os.path.join(ROOT, "content", "drafts", "**", "vocab-*.json"), recursive=True):
        d = json.load(open(f, encoding="utf-8"))
        if d.get("bundleSlug") in MANAGED:
            continue
        for e in d.get("entries", []):
            seen[e["normalized"]] = os.path.relpath(f, ROOT)
    return seen


REFL_PRON = {"1s": "me", "2s": "te", "3s": "se", "1p": "nos", "2p": "os", "3p": "se"}


def verb_entry(row: list[str], rank: int) -> dict:
    lemma, paradigm, level, msa, eg, ex_es, ex_ar, domain = row[:8]
    usage = row[8] if len(row) > 8 else ""
    if lemma.endswith("se"):
        base = lemma[:-2]
        forms = conjugate(base, paradigm)
        for f in forms:
            if f["kind"] == "conjugation":
                f["formEs"] = f'{REFL_PRON[f["person"]]} {f["formEs"]}'
    else:
        forms = conjugate(lemma, paradigm)
    note = usage or paradigm_note(lemma, paradigm)
    return {
        "headword": lemma, "normalized": norm_vocab(lemma), "kind": "word", "pos": "verb",
        "gender": None, "plural": None, "level": level, "register": "neutral",
        "ipa": ipa_es(lemma), "pronunciationHintAr": hint_ar(lemma), "internalRank": rank,
        "tags": [f"domain:{domain}", BATCH_TAG],
        "senses": [{
            "senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": None,
            "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": None,
            "usageNoteAr": note, "commonErrorAr": None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
        "forms": forms,
    }


PARADIGM_NOTES = {
    "": "فعل منتظم — كل الصيغ على النهايات القياسية.",
    "e-ie": "تغيّر الجذر e⇒ie في المضارع (كل الصيغ عدا nosotros/vosotros) والمضارع التام.",
    "o-ue": "تغيّر الجذر o⇒ue في المضارع (كل الصيغ عدا nosotros/vosotros) والمضارع التام.",
    "e-i": "تغيّر الجذر e⇒i في المضارع والمضارع التام، وe⇒i أيضًا في الظرف (‑iendo).",
    "u-ue": "تغيّر الجذر u⇒ue في المضارع والمضارع التام.",
    "irreg": "فعل شاذ — صيغه محفوظة في جدول الشذوذ بمولد التصريف (tools/gen/lexicon/morphology.py).",
}


def paradigm_note(lemma: str, paradigm: str) -> str:
    base = PARADIGM_NOTES.get(paradigm, f"نمط التصريف: {paradigm}.")
    return f"{base} المصدر: {lemma}."


def lex_entry(row: list[str], rank: int) -> dict:
    head, pos, gender, level, msa, eg, ex_es, ex_ar, domain = row[:9]
    kind = row[9] if len(row) > 9 else ("expression" if " " in head else "word")
    plural = noun_plural(head, gender) if pos == "noun" else None
    return {
        "headword": head, "normalized": norm_vocab(head), "kind": kind, "pos": pos,
        "gender": gender or None, "plural": plural, "level": level, "register": "neutral",
        "ipa": ipa_es(head), "pronunciationHintAr": hint_ar(head), "internalRank": rank,
        "tags": [f"domain:{domain}", BATCH_TAG],
        "senses": [{
            "senseNo": 1, "meaningArFusha": msa, "meaningArEg": eg, "glossEs": None,
            "exampleEs": ex_es, "exampleAr": ex_ar, "exampleArEg": None,
            "usageNoteAr": None, "commonErrorAr": None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
    }


def emit(bundle_slug: str, entries: list[dict]) -> None:
    doc = {
        "schemaVersion": "1.0.0",
        "bundleSlug": bundle_slug,
        "pronunciationNoteAr": PRON_NOTE,
        "source": {
            "title": f"حزمة {bundle_slug} — إعداد داخلي (بذور TSV قابلة للمراجعة)، تحتاج مراجعة بشرية قبل النشر",
            "url": "", "license": "internal-draft", "accessedAt": "2026-10-21",
            "rankingNote": RANK_NOTE,
        },
        "entries": entries,
    }
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"vocab-{bundle_slug}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"  ✓ {os.path.relpath(path, ROOT)}: {len(entries)} مدخلًا")


PLANS = [
    ("verbs", "verbs.tsv", verb_entry, "cv-lex-verbs-core"),
    ("nouns", "nouns.tsv", lex_entry, "cv-lex-nouns-core"),
    ("adjectives", "adjectives.tsv", lex_entry, "cv-lex-adjectives"),
    ("adverbs", "adverbs.tsv", lex_entry, "cv-lex-adverbs"),
    ("expressions", "expressions.tsv", lex_entry, "cv-lex-expressions"),
]


def main() -> int:
    only = None
    if "--only" in sys.argv:
        only = set(sys.argv[sys.argv.index("--only") + 1:])

    seen = existing_norms()
    failures = 0
    total = 0
    for name, rel, fn, slug in PLANS:
        if only and name not in only:
            continue
        path = os.path.join(SEEDS, rel)
        if not os.path.exists(path):
            print(f"  · لا ملف بذور: {rel}")
            continue
        rows = load_tsv(path)
        entries = []
        batch_seen = set()
        for i, row in enumerate(rows, 1):
            head = row[0]
            n = norm_vocab(head)
            if n in batch_seen:
                print(f"  ✗ {rel}:{i}: مكرر داخل البذور «{head}»")
                failures += 1
                continue
            if n in seen:
                print(f"  ✗ {rel}:{i}: «{head}» معرّف مسبقًا في {seen[n]} — استخدم الإحالة")
                failures += 1
                continue
            batch_seen.add(n)
            entries.append(fn(row, len(entries) + 1))
        emit(slug, entries)
        total += len(entries)
    print(f"الإجمالي المولَّد: {total} — إخفاقات: {failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
