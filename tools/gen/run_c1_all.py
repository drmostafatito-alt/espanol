# -*- coding: utf-8 -*-
"""Master generator for Level C1.
Generates all 28 remaining lessons for Units 2 through 8, completing 100% of Level C1.
Updates:
- content/drafts/c1/lesson-{slug}.json
- content/curriculum/curriculum-map.v1.json
- content/drafts/c1/paths.json
"""
import sys
import os
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'gen'))

import c1_u2_u3_u4
import c1_u5_u6
import c1_u7_u8

OUT_DIR = os.path.join(ROOT, 'content', 'drafts', 'c1')
CURRICULUM_PATH = os.path.join(ROOT, 'content', 'curriculum', 'curriculum-map.v1.json')
PATHS_PATH = os.path.join(ROOT, 'content', 'drafts', 'c1', 'paths.json')

UNITS_CONFIG = [
    {
        "unitSlug": "c1-u2-idioms",
        "titleAr": "التعبيرات الاصطلاحية والأمثال المتقدمة",
        "objectiveAr": "أن يفهم المتعلم ويوظف التعبيرات الاصطلاحية والأمثال البليغة في السياق الثقافي والفكري.",
        "lessons": [
            ("make_lesson_locuciones_adverbiales", c1_u2_u3_u4),
            ("make_lesson_modismos_cultos", c1_u2_u3_u4),
            ("make_lesson_refranes_pensamiento", c1_u2_u3_u4),
            ("make_lesson_metaforas_vida_cultura", c1_u2_u3_u4),
        ]
    },
    {
        "unitSlug": "c1-u3-academic-discourse",
        "titleAr": "الخطاب الأكاديمي والمناظرة الفكرية",
        "objectiveAr": "أن يتقن المتعلم أدوات التحليل والمناظرة والتلطيف المنهجي في المحافل الأكاديمية والمؤتمرات.",
        "lessons": [
            ("make_lesson_conectores_metadiscursivos", c1_u2_u3_u4),
            ("make_lesson_refutacion_dialectica", c1_u2_u3_u4),
            ("make_lesson_atenuacion_academica", c1_u2_u3_u4),
            ("make_lesson_ponencias_congresos", c1_u2_u3_u4),
        ]
    },
    {
        "unitSlug": "c1-u4-literature",
        "titleAr": "الأدب والنقد الأدبي المعمق",
        "objectiveAr": "أن يحلل المتعلم نصوص الأدب الإسباني من العصر الذهبي إلى الواقعية السحرية والمقال الفكري المعاصر.",
        "lessons": [
            ("make_lesson_siglo_de_oro", c1_u2_u3_u4),
            ("make_lesson_generacion_del_27", c1_u2_u3_u4),
            ("make_lesson_realismo_magico", c1_u2_u3_u4),
            ("make_lesson_critica_ensayo", c1_u2_u3_u4),
        ]
    },
    {
        "unitSlug": "c1-u5-regional",
        "titleAr": "الإسبانية الإيبيرية والأمريكية والتنوع اللهجي",
        "objectiveAr": "أن يستوعب المتعلم التنوع الصوتي والصرفي والمعجمي لعالم اللغة الإسبانية الواسع من الفوسيو إلى الإسبانية المحايدة.",
        "lessons": [
            ("make_lesson_voseo_variacion", c1_u5_u6),
            ("make_lesson_americanismos_lexicos", c1_u5_u6),
            ("make_lesson_prosodia_fonetica", c1_u5_u6),
            ("make_lesson_espanol_neutro", c1_u5_u6),
        ]
    },
    {
        "unitSlug": "c1-u6-translation",
        "titleAr": "الترجمة والمقارنة اللغوية الإسبانية-العربية",
        "objectiveAr": "أن يمارس المتعلم الترجمة القانونية والأدبية والمقارنة التركيبية متجاوزاً النظائر الخادعة والتداخل النحوي.",
        "lessons": [
            ("make_lesson_falsos_amigos_avanzados", c1_u5_u6),
            ("make_lesson_traduccion_juridica", c1_u5_u6),
            ("make_lesson_traduccion_literaria", c1_u5_u6),
            ("make_lesson_interferencias_sintacticas", c1_u5_u6),
        ]
    },
    {
        "unitSlug": "c1-u7-complex-negotiation",
        "titleAr": "المفاوضات المعقدة والتحكيم الدولي",
        "objectiveAr": "أن يكتسب المتعلم مهارات التفاوض الدبلوماسي والتحكيم التجاري وإدارة الأزمات الكبرى بلغة رفيعة.",
        "lessons": [
            ("make_lesson_diplomacia_multilateral", c1_u7_u8),
            ("make_lesson_arbitraje_comercial", c1_u7_u8),
            ("make_lesson_clausulas_compromiso", c1_u7_u8),
            ("make_lesson_comunicacion_crisis", c1_u7_u8),
        ]
    },
    {
        "unitSlug": "c1-u8-advanced-writing",
        "titleAr": "الكتابة المتقدمة والمقالات الكبرى",
        "objectiveAr": "أن يحرر المتعلم مقالات الرأي والتقارير المؤسسية والمقالات الفلسفية والخطب الاحتفالية بأسلوب فصيح مبهر.",
        "lessons": [
            ("make_lesson_articulo_opinion", c1_u7_u8),
            ("make_lesson_memoria_institucional", c1_u7_u8),
            ("make_lesson_ensayo_cultural", c1_u7_u8),
            ("make_lesson_discurso_conmemorativo", c1_u7_u8),
        ]
    }
]

def generate_lessons():
    generated_map = {}
    prev_slug = "c1-correspondencia-formal" # Last lesson of Unit 1
    
    for u_cfg in UNITS_CONFIG:
        unit_slug = u_cfg["unitSlug"]
        generated_map[unit_slug] = []
        
        for fn_name, mod in u_cfg["lessons"]:
            fn = getattr(mod, fn_name)
            ldoc = fn()
            lesson = ldoc["lesson"]
            slug = lesson["slug"]
            
            # Save json file
            out_path = os.path.join(OUT_DIR, f"lesson-{slug}.json")
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(ldoc, f, ensure_ascii=False, indent=2)
                f.write("\n")
                
            # Lesson metadata for curriculum map
            reqs = [] if prev_slug is None else [prev_slug]
            map_entry = {
                "slug": slug,
                "titleAr": lesson.get("titleAr", slug),
                "objectiveAr": lesson.get("objectiveAr") or "",
                "skills": lesson.get("skills", ["grammar", "vocabulary", "reading", "writing", "listening", "speaking"]),
                "status": "authored",
                "levelCode": "C1",
                "filePath": f"content/drafts/c1/lesson-{slug}.json",
                "requires": reqs
            }
            generated_map[unit_slug].append(map_entry)
            prev_slug = slug
            print(f"Generated {slug}: {len(lesson['exercises'])} exercises")
            
    return generated_map

def update_curriculum_map(generated_map):
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        cmap = json.load(f)
        
    for tr in cmap.get("tracks", []):
        for lvl in tr.get("levels", []):
            if lvl.get("levelCode") == "C1":
                for u in lvl.get("units", []):
                    u_slug = u.get("slug")
                    if u_slug in generated_map:
                        u["lessons"] = generated_map[u_slug]
                        u["plannedLessonCount"] = len(generated_map[u_slug])
                        
    with open(CURRICULUM_PATH, "w", encoding="utf-8") as f:
        json.dump(cmap, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Updated {CURRICULUM_PATH}")

def update_paths(generated_map):
    with open(PATHS_PATH, "r", encoding="utf-8") as f:
        pdata = json.load(f)
        
    units = pdata["programs"][0]["units"]
    existing_slugs = {u["slug"] for u in units}
    
    for order_idx, u_cfg in enumerate(UNITS_CONFIG, start=2):
        u_slug = u_cfg["unitSlug"]
        if u_slug not in existing_slugs:
            lesson_slugs = [l["slug"] for l in generated_map[u_slug]]
            units.append({
                "slug": u_slug,
                "levelCode": "C1",
                "titleAr": u_cfg["titleAr"],
                "sortOrder": order_idx,
                "status": "draft",
                "lessons": lesson_slugs,
                "vocabularyBundles": []
            })
            
    with open(PATHS_PATH, "w", encoding="utf-8") as f:
        json.dump(pdata, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Updated {PATHS_PATH}")

def main():
    print("Generating all C1 Units (2-8)...")
    generated_map = generate_lessons()
    print("Updating curriculum map...")
    update_curriculum_map(generated_map)
    print("Updating paths.json...")
    update_paths(generated_map)
    print("C1 generation complete!")

if __name__ == "__main__":
    main()
