# -*- coding: utf-8 -*-
"""Master generator for Level B2.
Generates all 36 remaining lessons for Units 2 through 10, completing 100% of Level B2.
Updates:
- content/drafts/b2/lesson-{slug}.json
- content/curriculum/curriculum-map.v1.json
- content/drafts/b2/paths.json
"""
import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'gen'))

import b2_u2_u3_u4
import b2_u5_u6_u7
import b2_u8_u9_u10

OUT_DIR = os.path.join(ROOT, 'content', 'drafts', 'b2')
CURRICULUM_PATH = os.path.join(ROOT, 'content', 'curriculum', 'curriculum-map.v1.json')
PATHS_PATH = os.path.join(ROOT, 'content', 'drafts', 'b2', 'paths.json')

UNITS_CONFIG = [
    {
        "unitSlug": "b2-u2-news",
        "titleAr": "الأخبار وتحليلها",
        "lessons": [
            ("make_lesson_analisis_prensa_editorial", b2_u2_u3_u4),
            ("make_lesson_pasiva_periodistica_se", b2_u2_u3_u4),
            ("make_lesson_hechos_vs_opiniones", b2_u2_u3_u4),
            ("make_lesson_entrevista_periodistica", b2_u2_u3_u4),
        ]
    },
    {
        "unitSlug": "b2-u3-literature",
        "titleAr": "نصوص أدبية مبسطة",
        "lessons": [
            ("make_lesson_literatura_narrativa_contemporanea", b2_u2_u3_u4),
            ("make_lesson_metaforas_recursos_literarios", b2_u2_u3_u4),
            ("make_lesson_analisis_personajes_relato", b2_u2_u3_u4),
            ("make_lesson_expresion_estetica_emociones", b2_u2_u3_u4),
        ]
    },
    {
        "unitSlug": "b2-u4-professional",
        "titleAr": "التواصل المهني",
        "lessons": [
            ("make_lesson_gestion_reuniones_orden_dia", b2_u2_u3_u4),
            ("make_lesson_informes_ejecutivos_kpis", b2_u2_u3_u4),
            ("make_lesson_correspondencia_corporativa", b2_u2_u3_u4),
            ("make_lesson_resolucion_conflictos_laborales", b2_u2_u3_u4),
        ]
    },
    {
        "unitSlug": "b2-u5-academic",
        "titleAr": "الكتابة الأكاديمية",
        "lessons": [
            ("make_lesson_estructura_ensayo_academico", b2_u5_u6_u7),
            ("make_lesson_citacion_fuentes_academicas", b2_u5_u6_u7),
            ("make_lesson_conectores_causa_efecto_avanzados", b2_u5_u6_u7),
            ("make_lesson_resumen_conclusiones_investigacion", b2_u5_u6_u7),
        ]
    },
    {
        "unitSlug": "b2-u6-negotiation",
        "titleAr": "التفاوض والإقناع",
        "lessons": [
            ("make_lesson_estrategias_negociacion_comercial", b2_u5_u6_u7),
            ("make_lesson_concesiones_condiciones_mutuas", b2_u5_u6_u7),
            ("make_lesson_persuasion_manejo_objeciones", b2_u5_u6_u7),
            ("make_lesson_acuerdo_clausulas_contractuales", b2_u5_u6_u7),
        ]
    },
    {
        "unitSlug": "b2-u7-environment",
        "titleAr": "البيئة والمجتمع",
        "lessons": [
            ("make_lesson_cambio_climatico_sostenibilidad", b2_u5_u6_u7),
            ("make_lesson_politicas_ambientales_subjuntivo", b2_u5_u6_u7),
            ("make_lesson_transformacion_social_demografia", b2_u5_u6_u7),
            ("make_lesson_debate_energia_desarrollo", b2_u5_u6_u7),
        ]
    },
    {
        "unitSlug": "b2-u8-presentations",
        "titleAr": "العروض والتقديم",
        "lessons": [
            ("make_lesson_apertura_presentacion_audiencia", b2_u8_u9_u10),
            ("make_lesson_descripcion_graficos_tendencias", b2_u8_u9_u10),
            ("make_lesson_gestion_preguntas_respuestas", b2_u8_u9_u10),
            ("make_lesson_conclusion_llamada_accion", b2_u8_u9_u10),
        ]
    },
    {
        "unitSlug": "b2-u9-formal-writing",
        "titleAr": "المراسلات الرسمية",
        "lessons": [
            ("make_lesson_reclamaciones_juridicas_instancias", b2_u8_u9_u10),
            ("make_lesson_carta_motivacion_becas_empleo", b2_u8_u9_u10),
            ("make_lesson_comunicacion_institucional_diplomatica", b2_u8_u9_u10),
            ("make_lesson_formulas_protocolarias_cierre", b2_u8_u9_u10),
        ]
    },
    {
        "unitSlug": "b2-u10-culture-deep",
        "titleAr": "الفروق الثقافية والإقليمية",
        "lessons": [
            ("make_lesson_variedades_linguisticas_hispanas", b2_u8_u9_u10),
            ("make_lesson_comunicacion_no_verbal_gestos", b2_u8_u9_u10),
            ("make_lesson_patrimonio_cultural_inmaterial", b2_u8_u9_u10),
            ("make_lesson_choque_cultural_integracion", b2_u8_u9_u10),
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
                "levelCode": "B2",
                "filePath": f"content/drafts/b2/lesson-{slug}.json",
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
            if lvl.get("levelCode") == "B2":
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

    # Base unit 1 is kept
    units = pdata["programs"][0]["units"]
    existing_slugs = {u["slug"] for u in units}

    for order_idx, u_cfg in enumerate(UNITS_CONFIG, start=2):
        u_slug = u_cfg["unitSlug"]
        if u_slug not in existing_slugs:
            lesson_slugs = [l["slug"] for l in generated_map[u_slug]]
            units.append({
                "slug": u_slug,
                "levelCode": "B2",
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
    print("Generating all B2 Units (2-10)...")
    generated_map = generate_lessons()
    print("Updating curriculum map...")
    update_curriculum_map(generated_map)
    print("Updating paths.json...")
    update_paths(generated_map)
    print("B2 generation complete!")

if __name__ == "__main__":
    main()
