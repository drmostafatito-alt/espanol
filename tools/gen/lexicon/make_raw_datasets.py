# -*- coding: utf-8 -*-
"""
make_raw_datasets.py — توليد البيانات المعجمية الشاملة (أكثر من 8,000 مدخل)
ينشئ ملفات raw_*.py في tools/gen/lexicon/data/
"""
import os
import sys

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)

print("Starting generation of lexical raw datasets...")
