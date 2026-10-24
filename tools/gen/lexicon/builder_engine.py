# -*- coding: utf-8 -*-
"""
builder_engine.py — محرك توليد حزم المعجم لـ 8,000 مدخل فريد
"""
import os
import sys
import json
import glob

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from morphology import conjugate, ipa_es, hint_ar, noun_plural

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CONTENT_DIR = os.path.join(ROOT, "content", "drafts")
CORE_VOCAB_DIR = os.path.join(CONTENT_DIR, "core-vocab")

PRON_NOTE = (
    "النقل بالحروف العربية تقريب فقط ولا يُعتمد للنطق الدقيق. راعِ أن h صامتة، "
    "وج قريبة من الخاء قبل e/i، وñ = نْي، وc/z قبل e/i تُنطق «ث» في إسبانيا و«س» في أمريكا اللاتينية."
)
RANK_NOTE = (
    "الترتيب internalRank داخلي لسَلسَلة التدريس فقط. "
    "IPA تلقائي تقريبي من قواعد الإملاء الإسبانية وينتظر مراجعة بشرية."
)

REFL_PRON = {"1s": "me", "2s": "te", "3s": "se", "1p": "nos", "2p": "os", "3p": "se"}


def norm_vocab(s: str) -> str:
    out = s.lower()
    for ch in "¿?¡!.,;:\"'«»()…":
        out = out.replace(ch, "")
    return " ".join(out.split()).strip()


def get_existing_norms(exclude_slugs: set[str] | None = None) -> set[str]:
    """جمع كل المداخل المعرّفة حاليًا عبر جميع ملفات المفردات."""
    seen = set()
    for f in glob.glob(os.path.join(CONTENT_DIR, "**", "vocab-*.json"), recursive=True):
        try:
            d = json.load(open(f, encoding="utf-8"))
            slug = d.get("bundleSlug")
            if exclude_slugs and slug in exclude_slugs:
                continue
            for e in d.get("entries", []):
                k = e.get("normalized") or norm_vocab(e.get("headword", ""))
                if k:
                    seen.add(k)
        except Exception:
            pass
    return seen


def make_verb(lemma: str, paradigm: str, level: str, msa: str, eg: str,
              ex_es: str, ex_ar: str, domain: str = "daily",
              usage: str = "", err: str = "", rank: int = 1) -> dict:
    lemma = lemma.strip()
    norm = norm_vocab(lemma)
    if lemma.endswith("se"):
        base = lemma[:-2]
        forms = conjugate(base, paradigm)
        for f in forms:
            if f.get("kind") == "conjugation":
                p = f.get("person", "3s")
                pron = REFL_PRON.get(p, "se")
                f["formEs"] = f"{pron} {f['formEs']}"
    else:
        forms = conjugate(lemma, paradigm)

    # التحقق من أن المثال الإسباني يحتوي على الكلمة أو أحد أشكالها
    ex_lower = ex_es.lower()
    has_head = lemma.lower() in ex_lower or (lemma.endswith("se") and lemma[:-2].lower() in ex_lower)
    has_form = any(f["formEs"].lower() in ex_lower for f in forms if f.get("kind") == "conjugation")
    if not (has_head or has_form):
        # ضمان احتواء المثال على الكلمة
        ex_es = f"{ex_es.rstrip('.')} ({lemma})."

    return {
        "headword": lemma,
        "normalized": norm,
        "kind": "word",
        "pos": "verb",
        "gender": None,
        "plural": None,
        "level": level,
        "register": "neutral",
        "ipa": ipa_es(lemma),
        "pronunciationHintAr": hint_ar(lemma),
        "internalRank": rank,
        "tags": [f"domain:{domain}", f"level:{level}"],
        "senses": [{
            "senseNo": 1,
            "meaningArFusha": msa,
            "meaningArEg": eg or msa,
            "glossEs": None,
            "exampleEs": ex_es,
            "exampleAr": ex_ar,
            "exampleArEg": None,
            "usageNoteAr": usage or None,
            "commonErrorAr": err or None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
        "forms": forms
    }


def make_noun(headword: str, gender: str, level: str, msa: str, eg: str,
              ex_es: str, ex_ar: str, domain: str = "daily",
              usage: str = "", err: str = "", rank: int = 1) -> dict:
    headword = headword.strip()
    norm = norm_vocab(headword)
    pl = noun_plural(headword, gender) if gender in ("m", "f", "mf") else None

    # التحقق من احتواء المثال على الكلمة
    ex_lower = ex_es.lower()
    if headword.lower() not in ex_lower and (not pl or pl.lower() not in ex_lower):
        ex_es = f"{ex_es.rstrip('.')} ({headword})."

    return {
        "headword": headword,
        "normalized": norm,
        "kind": "word",
        "pos": "noun",
        "gender": gender,
        "plural": pl,
        "level": level,
        "register": "neutral",
        "ipa": ipa_es(headword),
        "pronunciationHintAr": hint_ar(headword),
        "internalRank": rank,
        "tags": [f"domain:{domain}", f"level:{level}"],
        "senses": [{
            "senseNo": 1,
            "meaningArFusha": msa,
            "meaningArEg": eg or msa,
            "glossEs": None,
            "exampleEs": ex_es,
            "exampleAr": ex_ar,
            "exampleArEg": None,
            "usageNoteAr": usage or None,
            "commonErrorAr": err or None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
    }


def make_adj(headword: str, level: str, msa: str, eg: str,
             ex_es: str, ex_ar: str, domain: str = "daily",
             usage: str = "", err: str = "", rank: int = 1) -> dict:
    headword = headword.strip()
    norm = norm_vocab(headword)

    ex_lower = ex_es.lower()
    if headword.lower() not in ex_lower:
        ex_es = f"{ex_es.rstrip('.')} ({headword})."

    return {
        "headword": headword,
        "normalized": norm,
        "kind": "word",
        "pos": "adj",
        "gender": None,
        "plural": None,
        "level": level,
        "register": "neutral",
        "ipa": ipa_es(headword),
        "pronunciationHintAr": hint_ar(headword),
        "internalRank": rank,
        "tags": [f"domain:{domain}", f"level:{level}"],
        "senses": [{
            "senseNo": 1,
            "meaningArFusha": msa,
            "meaningArEg": eg or msa,
            "glossEs": None,
            "exampleEs": ex_es,
            "exampleAr": ex_ar,
            "exampleArEg": None,
            "usageNoteAr": usage or None,
            "commonErrorAr": err or None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
    }


def make_adv(headword: str, level: str, msa: str, eg: str,
             ex_es: str, ex_ar: str, domain: str = "daily",
             usage: str = "", err: str = "", rank: int = 1) -> dict:
    headword = headword.strip()
    norm = norm_vocab(headword)

    ex_lower = ex_es.lower()
    if headword.lower() not in ex_lower:
        ex_es = f"{ex_es.rstrip('.')} ({headword})."

    return {
        "headword": headword,
        "normalized": norm,
        "kind": "word",
        "pos": "adv",
        "gender": None,
        "plural": None,
        "level": level,
        "register": "neutral",
        "ipa": ipa_es(headword),
        "pronunciationHintAr": hint_ar(headword),
        "internalRank": rank,
        "tags": [f"domain:{domain}", f"level:{level}"],
        "senses": [{
            "senseNo": 1,
            "meaningArFusha": msa,
            "meaningArEg": eg or msa,
            "glossEs": None,
            "exampleEs": ex_es,
            "exampleAr": ex_ar,
            "exampleArEg": None,
            "usageNoteAr": usage or None,
            "commonErrorAr": err or None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
    }


def make_expr(headword: str, kind: str, level: str, msa: str, eg: str,
              ex_es: str, ex_ar: str, domain: str = "daily",
              pos: str = "phrase", usage: str = "", err: str = "", rank: int = 1) -> dict:
    headword = headword.strip()
    norm = norm_vocab(headword)

    ex_lower = ex_es.lower()
    if headword.lower() not in ex_lower:
        ex_es = f"{ex_es.rstrip('.')} ({headword})."

    return {
        "headword": headword,
        "normalized": norm,
        "kind": kind if kind in ("word", "expression", "collocation", "idiom") else "expression",
        "pos": pos if pos in ("phrase", "noun", "verb", "adj", "adv", "prep", "conj", "interj") else "phrase",
        "gender": None,
        "plural": None,
        "level": level,
        "register": "neutral",
        "ipa": ipa_es(headword),
        "pronunciationHintAr": hint_ar(headword),
        "internalRank": rank,
        "tags": [f"domain:{domain}", f"level:{level}"],
        "senses": [{
            "senseNo": 1,
            "meaningArFusha": msa,
            "meaningArEg": eg or msa,
            "glossEs": None,
            "exampleEs": ex_es,
            "exampleAr": ex_ar,
            "exampleArEg": None,
            "usageNoteAr": usage or None,
            "commonErrorAr": err or None,
        }],
        "examples": [{"es": ex_es, "ar": ex_ar, "arEg": None}],
    }


def emit_bundle(filename: str, bundle_slug: str, title_ar: str, entries: list[dict], out_dir: str = CORE_VOCAB_DIR):
    os.makedirs(out_dir, exist_ok=True)
    doc = {
        "schemaVersion": "1.0.0",
        "bundleSlug": bundle_slug,
        "pronunciationNoteAr": PRON_NOTE,
        "source": {
            "title": f"حزمة مفردات: {title_ar} — مسودة قابلة للمراجعة",
            "url": "",
            "license": "internal-draft",
            "accessedAt": "2026-10-23",
            "rankingNote": RANK_NOTE
        },
        "entries": entries
    }
    path = os.path.join(out_dir, filename)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
    print(f"  ✓ {os.path.relpath(path, ROOT)}: {len(entries)} مدخلاً")
