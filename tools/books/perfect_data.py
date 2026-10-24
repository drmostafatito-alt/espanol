# -*- coding: utf-8 -*-
"""
tools/books/perfect_data.py
Clean definitions for all 16 lessons across A2, B1, B2, C1.
"""

# Let's import the A2 data we already wrote in perfect_all_lessons.py earlier
# and add B1, B2, C1 with identical schema purity.

from perfect_data_a2 import A2_LESSONS
from perfect_data_b1 import B1_LESSONS
from perfect_data_b2 import B2_LESSONS
from perfect_data_c1 import C1_LESSONS

ALL_16_LESSONS = A2_LESSONS + B1_LESSONS + B2_LESSONS + C1_LESSONS
