# -*- coding: utf-8 -*-
"""Master generator for Level A2.
Generates all 32 remaining lessons for Units 3 through 10, completing 100% of Level A2.
Updates:
- content/drafts/a2/lesson-{slug}.json
- content/curriculum/curriculum-map.v1.json
- content/drafts/a2/paths.json
"""
import sys
import os
import json

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'gen'))

import a2_u3
import a2_u4_u5
import a2_u6_u7
import a2_u8_u9_u10

OUT_DIR = os.path.join(ROOT, 'content', 'drafts', 'a2')
CURRICULUM_PATH = os.path.join(ROOT, 'content', 'curriculum', 'curriculum-map.v1.json')
PATHS_PATH = os.path.join(ROOT, 'content', 'drafts', 'a2', 'paths.json')

UNITS_CONFIG = [
    {
        "unitSlug": "a2-u3-future-plans",
        "titleAr": "المستقبل والخطط القادمة",
        "lessons": [
            ("make_lesson_ir_a", a2_u3),
            ("make_lesson_planes_proyectos", a2_u3),
            ("make_lesson_condiciones_futuro", a2_u3),
            ("make_lesson_conversacion_planes", a2_u3),
        ]
    },
    {
        "unitSlug": "a2-u4-comparisons",
        "titleAr": "المقارنات والصفات والتفضيل",
        "lessons": [
            ("make_lesson_comparativos_superioridad", a2_u4_u5),
            ("make_lesson_comparativos_igualdad", a2_u4_u5),
            ("make_lesson_superlativos", a2_u4_u5),
            ("make_lesson_comparar_ciudades", a2_u4_u5),
        ]
    },
    {
        "unitSlug": "a2-u5-experiences",
        "titleAr": "تجارب الحياة والماضي المركب",
        "lessons": [
            ("make_lesson_perfecto_formacion", a2_u4_u5),
            ("make_lesson_participios_irregulares", a2_u4_u5),
            ("make_lesson_marcadores_experiencias", a2_u4_u5),
            ("make_lesson_hablar_de_experiencias", a2_u4_u5),
        ]
    },
    {
        "unitSlug": "a2-u6-health",
        "titleAr": "الصحة والعيادة والنصائح الطبية",
        "lessons": [
            ("make_lesson_sintomas_medico", a2_u6_u7),
            ("make_lesson_dar_consejos_deber", a2_u6_u7),
            ("make_lesson_imperativo_salud", a2_u6_u7),
            ("make_lesson_consulta_medica", a2_u6_u7),
        ]
    },
    {
        "unitSlug": "a2-u7-housing",
        "titleAr": "السكن والشقق وضمائر المفعول المباشر",
        "lessons": [
            ("make_lesson_tipos_vivienda", a2_u6_u7),
            ("make_lesson_pronombres_objeto_directo", a2_u6_u7),
            ("make_lesson_alquilar_piso", a2_u6_u7),
            ("make_lesson_visita_piso", a2_u6_u7),
        ]
    },
    {
        "unitSlug": "a2-u8-hobbies",
        "titleAr": "الرياضة والهوايات وأوقات الفراغ",
        "lessons": [
            ("make_lesson_deportes_tiempo_libre", a2_u8_u9_u10),
            ("make_lesson_gustos_preferencias_avanzadas", a2_u8_u9_u10),
            ("make_lesson_frecuencia_actividades", a2_u8_u9_u10),
            ("make_lesson_conversacion_hobbies", a2_u8_u9_u10),
        ]
    },
    {
        "unitSlug": "a2-u9-phone-booking",
        "titleAr": "المكالمات الهاتفية وحجز المواعيد والرسائل",
        "lessons": [
            ("make_lesson_llamadas_telefonicas", a2_u8_u9_u10),
            ("make_lesson_pedir_citas", a2_u8_u9_u10),
            ("make_lesson_mensajes_recados", a2_u8_u9_u10),
            ("make_lesson_dialogo_reserva", a2_u8_u9_u10),
        ]
    },
    {
        "unitSlug": "a2-u10-culture",
        "titleAr": "الثقافة والتقاليد وصيغة Se غير المحددة للفاعل",
        "lessons": [
            ("make_lesson_fiestas_tradiciones", a2_u8_u9_u10),
            ("make_lesson_impersonal_se", a2_u8_u9_u10),
            ("make_lesson_contrastes_culturales", a2_u8_u9_u10),
            ("make_lesson_mi_pais_costumbres", a2_u8_u9_u10),
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
                "levelCode": "A2",
                "filePath": f"content/drafts/a2/lesson-{slug}.json",
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
            if lvl.get("levelCode") == "A2":
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
                "levelCode": "A2",
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
    print("Generating all A2 Units (3-10)...")
    generated_map = generate_lessons()
    print("Updating curriculum map...")
    update_curriculum_map(generated_map)
    print("Updating paths.json...")
    update_paths(generated_map)
    print("A2 generation complete!")

if __name__ == "__main__":
    main()
