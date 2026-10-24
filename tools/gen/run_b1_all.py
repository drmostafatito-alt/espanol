# -*- coding: utf-8 -*-
"""Master generator for Level B1.
Generates all 32 remaining lessons for Units 3 through 10, completing 100% of Level B1.
Updates:
- content/drafts/b1/lesson-{slug}.json
- content/curriculum/curriculum-map.v1.json
- content/drafts/b1/paths.json
"""
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'gen'))

import b1_u3_u4
import b1_u5_u6
import b1_u7_u8
import b1_u9_u10

OUT_DIR = os.path.join(ROOT, 'content', 'drafts', 'b1')
CURRICULUM_PATH = os.path.join(ROOT, 'content', 'curriculum', 'curriculum-map.v1.json')
PATHS_PATH = os.path.join(ROOT, 'content', 'drafts', 'b1', 'paths.json')

UNITS_CONFIG = [
    {
        "unitSlug": "b1-u3-work",
        "titleAr": "العمل والمقابلات",
        "lessons": [
            ("make_lesson_entrevistas_trabajo", b1_u3_u4),
            ("make_lesson_curriculum_competencias", b1_u3_u4),
            ("make_lesson_condiciones_laborales", b1_u3_u4),
            ("make_lesson_conversacion_profesional", b1_u3_u4),
        ]
    },
    {
        "unitSlug": "b1-u4-study",
        "titleAr": "الدراسة والتعلّم",
        "lessons": [
            ("make_lesson_estudios_universidad", b1_u3_u4),
            ("make_lesson_expresar_duda_probabilidad", b1_u3_u4),
            ("make_lesson_planes_academicos", b1_u3_u4),
            ("make_lesson_debate_educacion", b1_u3_u4),
        ]
    },
    {
        "unitSlug": "b1-u5-independent-travel",
        "titleAr": "السفر المستقل والمشكلات",
        "lessons": [
            ("make_lesson_viajes_imprevistos", b1_u5_u6),
            ("make_lesson_reclamaciones_viaje", b1_u5_u6),
            ("make_lesson_alojamiento_alternativo", b1_u5_u6),
            ("make_lesson_guia_consejos_viajero", b1_u5_u6),
        ]
    },
    {
        "unitSlug": "b1-u6-problems",
        "titleAr": "حل المشكلات والشكاوى",
        "lessons": [
            ("make_lesson_hoja_reclamaciones", b1_u5_u6),
            ("make_lesson_expresar_quejas_molestias", b1_u5_u6),
            ("make_lesson_pedir_soluciones_reparacion", b1_u5_u6),
            ("make_lesson_dialogo_atencion_cliente", b1_u5_u6),
        ]
    },
    {
        "unitSlug": "b1-u7-media",
        "titleAr": "الإعلام والأخبار المبسطة",
        "lessons": [
            ("make_lesson_noticias_prensa", b1_u7_u8),
            ("make_lesson_estilo_indirecto_presente", b1_u7_u8),
            ("make_lesson_estilo_indirecto_pasado", b1_u7_u8),
            ("make_lesson_cronica_periodistica", b1_u7_u8),
        ]
    },
    {
        "unitSlug": "b1-u8-health-lifestyle",
        "titleAr": "الصحة ونمط الحياة",
        "lessons": [
            ("make_lesson_habitos_saludables", b1_u7_u8),
            ("make_lesson_subjuntivo_recomendaciones", b1_u7_u8),
            ("make_lesson_bienestar_emocional", b1_u7_u8),
            ("make_lesson_consulta_especialista", b1_u7_u8),
        ]
    },
    {
        "unitSlug": "b1-u9-relationships",
        "titleAr": "العلاقات والمجتمع",
        "lessons": [
            ("make_lesson_relaciones_personales", b1_u9_u10),
            ("make_lesson_subjuntivo_sentimientos", b1_u9_u10),
            ("make_lesson_ojala_deseos", b1_u9_u10),
            ("make_lesson_conflictos_convivencia", b1_u9_u10),
        ]
    },
    {
        "unitSlug": "b1-u10-writing-basics",
        "titleAr": "الكتابة الوظيفية",
        "lessons": [
            ("make_lesson_conectores_discursivos", b1_u9_u10),
            ("make_lesson_carta_formal_correo", b1_u9_u10),
            ("make_lesson_agradecimiento_disculpa", b1_u9_u10),
            ("make_lesson_redaccion_argumentativa", b1_u9_u10),
        ]
    }
]

def generate_lessons():
    os.makedirs(OUT_DIR, exist_ok=True)
    generated_map = {}

    for u_idx, u_cfg in enumerate(UNITS_CONFIG):
        unit_slug = u_cfg["unitSlug"]
        generated_map[unit_slug] = []
        prev_slug = None

        for l_func_name, mod in u_cfg["lessons"]:
            fn = getattr(mod, l_func_name)
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
                "objectiveAr": lesson.get("objectiveAr") or (lesson.get("pedagogy", {}).get("learningObjectivesAr") or [""])[0],
                "skills": lesson.get("skills", ["grammar", "vocabulary", "reading", "writing", "listening", "speaking"]),
                "status": "authored",
                "levelCode": "B1",
                "filePath": f"content/drafts/b1/lesson-{slug}.json",
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
            if lvl.get("levelCode") == "B1":
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

    # Base units 1 and 2 are kept
    units = pdata["programs"][0]["units"]
    existing_slugs = {u["slug"] for u in units}

    for order_idx, u_cfg in enumerate(UNITS_CONFIG, start=3):
        u_slug = u_cfg["unitSlug"]
        if u_slug not in existing_slugs:
            lesson_slugs = [l["slug"] for l in generated_map[u_slug]]
            units.append({
                "slug": u_slug,
                "levelCode": "B1",
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
    print("Generating all B1 Units (3-10)...")
    generated_map = generate_lessons()
    print("Updating curriculum map...")
    update_curriculum_map(generated_map)
    print("Updating paths.json...")
    update_paths(generated_map)
    print("B1 generation complete!")

if __name__ == "__main__":
    main()
