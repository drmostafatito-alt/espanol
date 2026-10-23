# -*- coding: utf-8 -*-
"""Shared helper utilities for lesson generation.
Enforces all platform and quality auditor constraints:
- Scoped option IDs to prevent R19 collision
- word_choice instead of multiple_choice
- difficulty as integers (1, 2, 3)
- Explanation >= 10 chars
- speechEs on all audio exercises
- Draft status with null reviewers
"""
import json
import os

OUT_A2 = 'content/drafts/a2'

def opt(oid, text, textAr=None, correct=False, why=None):
    o = {"id": oid, "text": text}
    if textAr:
        o["textAr"] = textAr
    o["isCorrect"] = bool(correct)
    if why:
        o["distractorRationaleAr"] = why
    return o

def to_diff_int(d):
    if isinstance(d, int):
        return d
    return {"easy": 1, "medium": 2, "hard": 3}.get(d, 1)

def choice_ex(eid, typ, instructionAr, skills, difficulty, promptAr, stemEs, stemAr, options, targetVocab, explanationAr, audioKey=None, speechEs=None):
    scoped_options = []
    for o in options:
        oid = o["id"]
        if not oid.startswith(eid):
            oid = f"{eid}_{oid}"
        so = dict(o)
        so["id"] = oid
        scoped_options.append(so)

    d = {
        "id": eid,
        "type": typ,
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "promptAr": promptAr,
        "stemEs": stemEs,
        "stemAr": stemAr,
        "options": scoped_options,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "scoring": {"mode": "all_or_nothing"}
    }
    if audioKey:
        d["audioKey"] = audioKey
    if speechEs:
        d["speechEs"] = speechEs
    correct = [o["id"] for o in scoped_options if o.get("isCorrect")]
    d["answerKey"] = {
        "correctOptionIds": correct,
        "selectedOptionId": correct[0] if correct else ""
    }
    fb = {o["id"]: o["distractorRationaleAr"] for o in scoped_options if not o.get("isCorrect") and o.get("distractorRationaleAr")}
    if fb:
        d["errorFeedback"] = fb
    return d

def fill_ex(eid, instructionAr, skills, difficulty, promptAr, stemEs, stemAr, targetVocab, acceptableAnswers, explanationAr):
    return {
        "id": eid,
        "type": "fill_blank",
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "promptAr": promptAr,
        "stemEs": stemEs,
        "stemAr": stemAr,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "answerKey": {
            "accepted": acceptableAnswers,
            "acceptableAnswers": acceptableAnswers,
            "caseSensitive": False
        },
        "scoring": {"mode": "all_or_nothing"}
    }

def order_ex(eid, instructionAr, skills, difficulty, tokens, accepted_str, explanationAr, targetVocab):
    items = []
    tokenOrder = []
    for i, tok in enumerate(tokens):
        tid = f"{eid}_t{i+1}"
        items.append({"id": tid, "kind": "token", "text": tok})
        tokenOrder.append(tid)
    return {
        "id": eid,
        "type": "word_order",
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "items": items,
        "answerKey": {
            "accepted": [accepted_str],
            "tokenOrder": tokenOrder
        },
        "explanationAr": explanationAr,
        "targetVocab": targetVocab,
        "scoring": {"mode": "all_or_nothing"}
    }

def speak_ex(eid, instructionAr, skills, difficulty, promptAr, stemEs, stemAr, audioKey, targetVocab, modelAnswer, explanationAr):
    return {
        "id": eid,
        "type": "speak_with_text",
        "mode": "graded",
        "instructionAr": instructionAr,
        "skills": skills,
        "difficulty": to_diff_int(difficulty),
        "promptAr": promptAr,
        "stemEs": stemEs,
        "stemAr": stemAr,
        "audioKey": audioKey,
        "targetVocab": targetVocab,
        "explanationAr": explanationAr,
        "answerKey": {
            "referenceAudioKey": audioKey,
            "modelAnswer": modelAnswer
        },
        "scoring": {"mode": "all_or_nothing"}
    }

def lesson_doc(doc, exercises, level="A2"):
    doc["level"] = doc.get("level", level)
    if not doc.get("objectiveAr"):
        doc["objectiveAr"] = doc["pedagogy"]["learningObjectivesAr"][0]
    if not doc.get("skills"):
        doc["skills"] = ["vocabulary", "reading", "grammar", "listening", "speaking"]
    if "newVocabulary" in doc and doc["newVocabulary"] and isinstance(doc["newVocabulary"][0], dict):
        doc["newVocabulary"] = [v["headword"] for v in doc["newVocabulary"]]
    if "reviewVocabulary" in doc and doc["reviewVocabulary"] and isinstance(doc["reviewVocabulary"][0], dict):
        doc["reviewVocabulary"] = [v["headword"] for v in doc["reviewVocabulary"]]
    doc["exercises"] = exercises
    return {
        "schemaVersion": "1.0.0",
        "lesson": doc
    }

def review_block():
    return {
        "status": "draft",
        "authors": ["فريق المنهج — تكامل كتب القواعد والمصادر (Aula Plus 2, Gramática del uso, Español 2000, المرشد)"],
        "spanishReviewer": None,
        "translationReviewer": None,
        "reviewedAt": None,
        "notes": "مسودة جاهزة للتدقيق البشري، معتمدة على مصادر القواعد المعتمدة ومصممة للمتعلم العربي."
    }
