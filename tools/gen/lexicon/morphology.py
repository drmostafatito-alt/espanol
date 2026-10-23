# -*- coding: utf-8 -*-
"""
morphology.py — محرك التصريف الإسباني (بشري المنشأ، قواعد معلنة)

يولّد صيغ: presente · pretérito indefinido · imperfecto · futuro · condicional
· subjuntivo presente · gerundio · participio.

الفلسفة:
  - قواعد منتظمة صريحة (نهايات -ar/-er/-ir + قواعد الكتابة car→qu…).
  - أنماط تغيّر الجذر (e→ie, o→ue, e→i, u→ue) مع استثناء nosotros/vosotros.
  - جداول overrides للأفعال شديدة الشذوذ (ser, ir, haber…).
  - IPA من قواعد إملاء-إلى-صوت (تقريب موثّق، إسبانية أوروبية أساسًا).
  - تلميح النطق العربي: تقريب فقط (موثّق في الملاحظات).

لا يدّعي الكمال اللهجي؛ أي استثناء غير مغطى يُمرَّر في overrides بدل التخمين.
"""
from __future__ import annotations

PERSONS = ["1s", "2s", "3s", "1p", "2p", "3p"]

# ------------------------------- النهايات ----------------------------------
ENDINGS = {
    "presente": {
        "ar": ["o", "as", "a", "amos", "áis", "an"],
        "er": ["o", "es", "e", "emos", "éis", "en"],
        "ir": ["o", "es", "e", "imos", "ís", "en"],
    },
    "pretérito": {
        "ar": ["é", "aste", "ó", "amos", "asteis", "aron"],
        "er": ["í", "iste", "ió", "imos", "isteis", "ieron"],
        "ir": ["í", "iste", "ió", "imos", "isteis", "ieron"],
    },
    "imperfecto": {
        "ar": ["aba", "abas", "aba", "ábamos", "abais", "aban"],
        "er": ["ía", "ías", "ía", "íamos", "íais", "ían"],
        "ir": ["ía", "ías", "ía", "íamos", "íais", "ían"],
    },
    "futuro": {
        "ar": ["é", "ás", "á", "emos", "éis", "án"],
        "er": ["é", "ás", "á", "emos", "éis", "án"],
        "ir": ["é", "ás", "á", "emos", "éis", "án"],
    },
    "condicional": {
        "ar": ["ía", "ías", "ía", "íamos", "íais", "ían"],
        "er": ["ía", "ías", "ía", "íamos", "íais", "ían"],
        "ir": ["ía", "ías", "ía", "íamos", "íais", "ían"],
    },
    "subjuntivo presente": {
        "ar": ["e", "es", "e", "emos", "éis", "en"],
        "er": ["a", "as", "a", "amos", "áis", "an"],
        "ir": ["a", "as", "a", "amos", "áis", "an"],
    },
}

# تغيّر الجذر: يشمل presente كل الصيغ عدا 1p/2p، وsubjuntivo presente كل الصيغ،
# وفي الأفعال المنتهية بـ-ir يمتد إلى gerundio (e→i, o→ue→u).
STEM_CHANGE = {"e-ie": ("e", "ie"), "o-ue": ("o", "ue"), "e-i": ("e", "i"), "u-ue": ("u", "ue")}

# أفعال شديدة الشذوذ: صيغ كاملة جاهزة لكل زمن
IRREGULAR: dict[str, dict[str, list[str]]] = {
    "ser": {
        "presente": ["soy", "eres", "es", "somos", "sois", "son"],
        "pretérito": ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
        "imperfecto": ["era", "eras", "era", "éramos", "erais", "eran"],
        "subjuntivo presente": ["sea", "seas", "sea", "seamos", "seáis", "sean"],
        "gerundio": ["siendo"], "participio": ["sido"],
    },
    "estar": {
        "presente": ["estoy", "estás", "está", "estamos", "estáis", "están"],
        "pretérito": ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
        "subjuntivo presente": ["esté", "estés", "esté", "estemos", "estéis", "estén"],
        "gerundio": ["estando"], "participio": ["estado"],
    },
    "ir": {
        "presente": ["voy", "vas", "va", "vamos", "vais", "van"],
        "pretérito": ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
        "imperfecto": ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
        "subjuntivo presente": ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"],
        "gerundio": ["yendo"], "participio": ["ido"],
    },
    "haber": {
        "presente": ["he", "has", "ha", "hemos", "habéis", "han"],
        "pretérito": ["hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron"],
        "subjuntivo presente": ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"],
        "gerundio": ["habiendo"], "participio": ["habido"],
    },
    "tener": {
        "presente": ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"],
        "pretérito": ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"],
        "futuro": ["tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán"],
        "condicional": ["tendría", "tendrías", "tendría", "tendríamos", "tendríais", "tendrían"],
        "subjuntivo presente": ["tenga", "tengas", "tenga", "tengamos", "tengáis", "tengan"],
        "gerundio": ["teniendo"], "participio": ["tenido"],
    },
    "hacer": {
        "presente": ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"],
        "pretérito": ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"],
        "futuro": ["haré", "harás", "hará", "haremos", "haréis", "harán"],
        "condicional": ["haría", "harías", "haría", "haríamos", "haríais", "harían"],
        "subjuntivo presente": ["haga", "hagas", "haga", "hagamos", "hagáis", "hagan"],
        "gerundio": ["haciendo"], "participio": ["hecho"],
    },
    "poder": {
        "presente": ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"],
        "pretérito": ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"],
        "futuro": ["podré", "podrás", "podrá", "podremos", "podréis", "podrán"],
        "condicional": ["podría", "podrías", "podría", "podríamos", "podríais", "podrían"],
        "subjuntivo presente": ["pueda", "puedas", "pueda", "podamos", "podáis", "puedan"],
        "gerundio": ["pudiendo"], "participio": ["podido"],
    },
    "saber": {
        "presente": ["sé", "sabes", "sabe", "sabemos", "sabéis", "saben"],
        "pretérito": ["supe", "supiste", "supo", "supimos", "supisteis", "supieron"],
        "futuro": ["sabré", "sabrás", "sabrá", "sabremos", "sabréis", "sabrán"],
        "condicional": ["sabría", "sabrías", "sabría", "sabríamos", "sabríais", "sabrían"],
        "subjuntivo presente": ["sepa", "sepas", "sepa", "sepamos", "sepáis", "sepan"],
        "gerundio": ["sabiendo"], "participio": ["sabido"],
    },
    "decir": {
        "presente": ["digo", "dices", "dice", "decimos", "decís", "dicen"],
        "pretérito": ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"],
        "futuro": ["diré", "dirás", "dirá", "diremos", "diréis", "dirán"],
        "condicional": ["diría", "dirías", "diría", "diríamos", "diríais", "dirían"],
        "subjuntivo presente": ["diga", "digas", "diga", "digamos", "digáis", "digan"],
        "gerundio": ["diciendo"], "participio": ["dicho"],
    },
    "dar": {
        "presente": ["doy", "das", "da", "damos", "dais", "dan"],
        "pretérito": ["di", "diste", "dio", "dimos", "disteis", "dieron"],
        "subjuntivo presente": ["dé", "des", "dé", "demos", "deis", "den"],
        "gerundio": ["dando"], "participio": ["dado"],
    },
    "ver": {
        "presente": ["veo", "ves", "ve", "vemos", "veis", "ven"],
        "pretérito": ["vi", "viste", "vio", "vimos", "visteis", "vieron"],
        "imperfecto": ["veía", "veías", "veía", "veíamos", "veíais", "veían"],
        "subjuntivo presente": ["vea", "veas", "vea", "veamos", "veáis", "vean"],
        "gerundio": ["viendo"], "participio": ["visto"],
    },
    "venir": {
        "presente": ["vengo", "vienes", "viene", "venimos", "venís", "vienen"],
        "pretérito": ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"],
        "futuro": ["vendré", "vendrás", "vendrá", "vendremos", "vendréis", "vendrán"],
        "condicional": ["vendría", "vendrías", "vendría", "vendríamos", "vendríais", "vendrían"],
        "subjuntivo presente": ["venga", "vengas", "venga", "vengamos", "vengáis", "vengan"],
        "gerundio": ["viniendo"], "participio": ["venido"],
    },
    "poner": {
        "presente": ["pongo", "pones", "pone", "ponemos", "ponéis", "ponen"],
        "pretérito": ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"],
        "futuro": ["pondré", "pondrás", "pondrá", "pondremos", "pondréis", "pondrán"],
        "condicional": ["pondría", "pondrías", "pondría", "pondríamos", "pondríais", "pondrían"],
        "subjuntivo presente": ["ponga", "pongas", "ponga", "pongamos", "pongáis", "pongan"],
        "gerundio": ["poniendo"], "participio": ["puesto"],
    },
    "salir": {
        "presente": ["salgo", "sales", "sale", "salimos", "salís", "salen"],
        "futuro": ["saldré", "saldrás", "saldrá", "saldremos", "saldréis", "saldrán"],
        "condicional": ["saldría", "saldrías", "saldría", "saldríamos", "saldríais", "saldrían"],
        "subjuntivo presente": ["salga", "salgas", "salga", "salgamos", "salgáis", "salgan"],
    },
    "traer": {
        "presente": ["traigo", "traes", "trae", "traemos", "traéis", "traen"],
        "pretérito": ["traje", "trajiste", "trajo", "trajimos", "trajisteis", "trajeron"],
        "subjuntivo presente": ["traiga", "traigas", "traiga", "traigamos", "traigáis", "traigan"],
        "gerundio": ["trayendo"], "participio": ["traído"],
    },
    "conocer": {
        "presente": ["conozco", "conoces", "conoce", "conocemos", "conocéis", "conocen"],
        "subjuntivo presente": ["conozca", "conozcas", "conozca", "conozcamos", "conozcáis", "conozcan"],
    },
    "parecer": {
        "presente": ["parezco", "pareces", "parece", "parecemos", "parecéis", "parecen"],
        "subjuntivo presente": ["parezca", "parezcas", "parezca", "parezcamos", "parezcáis", "parezcan"],
    },
    "traducir": {
        "presente": ["traduzco", "traduces", "traduce", "traducimos", "traducís", "traducen"],
        "pretérito": ["traduje", "tradujiste", "tradujo", "tradujimos", "tradujisteis", "tradujeron"],
        "subjuntivo presente": ["traduzca", "traduzcas", "traduzca", "traduzcamos", "traduzcáis", "traduzcan"],
    },
    "conducir": {
        "presente": ["conduzco", "conduces", "conduce", "conducimos", "conducís", "conducen"],
        "pretérito": ["conduje", "condujiste", "condujo", "condujimos", "condujisteis", "condujeron"],
        "subjuntivo presente": ["conduzca", "conduzcas", "conduzca", "conduzcamos", "conduzcáis", "conduzcan"],
    },
    "leer": {
        "pretérito": ["leí", "leíste", "leyó", "leímos", "leísteis", "leyeron"],
        "gerundio": ["leyendo"],
    },
    "oír": {
        "presente": ["oigo", "oyes", "oye", "oímos", "oís", "oyen"],
        "pretérito": ["oí", "oíste", "oyó", "oímos", "oísteis", "oyeron"],
        "subjuntivo presente": ["oiga", "oigas", "oiga", "oigamos", "oigáis", "oigan"],
        "gerundio": ["oyendo"], "participio": ["oído"],
    },
    "caer": {
        "pretérito": ["caí", "caíste", "cayó", "caímos", "caísteis", "cayeron"],
        "subjuntivo presente": ["caiga", "caigas", "caiga", "caigamos", "caigáis", "caigan"],
        "gerundio": ["cayendo"], "participio": ["caído"],
    },
    "creer": {"pretérito": ["creí", "creíste", "creyó", "creímos", "creísteis", "creyeron"], "gerundio": ["creyendo"]},
    "construir": {"presente": ["construyo", "construyes", "construye", "construimos", "construís", "construyen"],
                  "pretérito": ["construí", "construiste", "construyó", "construimos", "construisteis", "construyeron"],
                  "subjuntivo presente": ["construya", "construyas", "construya", "construyamos", "construyáis", "construyan"],
                  "gerundio": ["construyendo"]},
    "jugar": {"presente": ["juego", "juegas", "juega", "jugamos", "jugáis", "juegan"],
              "subjuntivo presente": ["juegue", "juegues", "juegue", "juguemos", "juguéis", "jueguen"]},
    "querer": {
        "presente": ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"],
        "pretérito": ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"],
        "futuro": ["querré", "querrás", "querrá", "querremos", "querréis", "querrán"],
        "condicional": ["querría", "querrías", "querría", "querríamos", "querríais", "querrían"],
        "subjuntivo presente": ["quiera", "quieras", "quiera", "queramos", "queráis", "quieran"],
    },
    "caber": {
        "presente": ["quepo", "cabes", "cabe", "cabemos", "cabéis", "caben"],
        "pretérito": ["cupe", "cupiste", "cupo", "cupimos", "cupisteis", "cupieron"],
        "futuro": ["cabré", "cabrás", "cabrá", "cabremos", "cabréis", "cabrán"],
        "condicional": ["cabría", "cabrías", "cabría", "cabríamos", "cabríais", "cabrían"],
        "subjuntivo presente": ["quepa", "quepas", "quepa", "quepamos", "quepáis", "quepan"],
    },
    "valer": {"futuro": ["valdré", "valdrás", "valdrá", "valdremos", "valdréis", "valdrán"],
              "condicional": ["valdría", "valdrías", "valdría", "valdríamos", "valdríais", "valdrían"],
              "subjuntivo presente": ["valga", "valgas", "valga", "valgamos", "valgáis", "valgan"]},
    "abrir": {"participio": ["abierto"]},
    "cubrir": {"participio": ["cubierto"]},
    "descubrir": {"participio": ["descubierto"]},
    "escribir": {"participio": ["escrito"]},
    "imprimir": {"participio": ["impreso"]},
    "romper": {"participio": ["roto"]},
    "morir": {"presente": ["muero", "mueres", "muere", "morimos", "morís", "mueren"],
              "pretérito": ["morí", "moriste", "murió", "morimos", "moristeis", "murieron"],
              "subjuntivo presente": ["muera", "mueras", "muera", "muramos", "muráis", "mueran"],
              "gerundio": ["muriendo"], "participio": ["muerto"]},
    "volver": {"presente": ["vuelvo", "vuelves", "vuelve", "volvemos", "volvéis", "vuelven"],
               "subjuntivo presente": ["vuelva", "vuelvas", "vuelva", "volvamos", "volváis", "vuelvan"],
               "participio": ["vuelto"]},
    "resolver": {"presente": ["resuelvo", "resuelves", "resuelve", "resolvemos", "resolvéis", "resuelven"],
                 "subjuntivo presente": ["resuelva", "resuelvas", "resuelva", "resolvamos", "resolváis", "resuelvan"],
                 "participio": ["resuelto"]},
    "pedir": {"presente": ["pido", "pides", "pide", "pedimos", "pedís", "piden"],
              "pretérito": ["pedí", "pediste", "pidió", "pedimos", "pedisteis", "pidieron"],
              "subjuntivo presente": ["pida", "pidas", "pida", "pidamos", "pidáis", "pidan"],
              "gerundio": ["pidiendo"]},
    "dormir": {"presente": ["duermo", "duermes", "duerme", "dormimos", "dormís", "duermen"],
               "pretérito": ["dormí", "dormiste", "durmió", "dormimos", "dormisteis", "durmieron"],
               "subjuntivo presente": ["duerma", "duermas", "duerma", "durmamos", "durmáis", "duerman"],
               "gerundio": ["durmiendo"]},
    "sentir": {"presente": ["siento", "sientes", "siente", "sentimos", "sentís", "sienten"],
               "pretérito": ["sentí", "sentiste", "sintió", "sentimos", "sentisteis", "sintieron"],
               "subjuntivo presente": ["sienta", "sientas", "sienta", "sintamos", "sintáis", "sientan"],
               "gerundio": ["sintiendo"]},
    "servir": {"presente": ["sirvo", "sirves", "sirve", "servimos", "servís", "sirven"],
               "pretérito": ["serví", "serviste", "sirvió", "servimos", "servisteis", "sirvieron"],
               "subjuntivo presente": ["sirva", "sirvas", "sirva", "sirvamos", "sirváis", "sirvan"],
               "gerundio": ["sirviendo"]},
    "seguir": {"presente": ["sigo", "sigues", "sigue", "seguimos", "seguís", "siguen"],
               "pretérito": ["seguí", "seguiste", "siguió", "seguimos", "seguisteis", "siguieron"],
               "subjuntivo presente": ["siga", "sigas", "siga", "sigamos", "sigáis", "sigan"],
               "gerundio": ["siguiendo"]},
    "elegir": {"presente": ["elijo", "eliges", "elige", "elegimos", "elegís", "eligen"],
               "pretérito": ["elegí", "elegiste", "eligió", "elegimos", "elegisteis", "eligieron"],
               "subjuntivo presente": ["elija", "elijas", "elija", "elijamos", "elijáis", "elijan"],
               "gerundio": ["eligiendo"], "participio": ["elegido"]},
    "vestir": {"presente": ["visto", "vistes", "viste", "vestimos", "vestís", "visten"],
               "pretérito": ["vestí", "vestiste", "vistió", "vestimos", "vestisteis", "vistieron"],
               "subjuntivo presente": ["vista", "vistas", "vista", "vistamos", "vistáis", "vistan"],
               "gerundio": ["vistiendo"]},
    "empezar": {"presente": ["empiezo", "empiezas", "empieza", "empezamos", "empezáis", "empiezan"],
                "pretérito": ["empecé", "empezaste", "empezó", "empezamos", "empezasteis", "empezaron"],
                "subjuntivo presente": ["empiece", "empieces", "empiece", "empecemos", "empecéis", "empiecen"]},
    "comenzar": {"presente": ["comienzo", "comienzas", "comienza", "comenzamos", "comenzáis", "comienzan"],
                 "pretérito": ["comencé", "comenzaste", "comenzó", "comenzamos", "comenzasteis", "comenzaron"],
                 "subjuntivo presente": ["comience", "comiences", "comience", "comencemos", "comencéis", "comiencen"]},
    "cerrar": {"presente": ["cierro", "cierras", "cierra", "cerramos", "cerráis", "cierran"],
               "subjuntivo presente": ["cierre", "cierres", "cierre", "cerremos", "cerréis", "cierren"]},
    "contar": {"presente": ["cuento", "cuentas", "cuenta", "contamos", "contáis", "cuentan"],
               "subjuntivo presente": ["cuente", "cuentes", "cuente", "contemos", "contéis", "cuenten"]},
    "encontrar": {"presente": ["encuentro", "encuentras", "encuentra", "encontramos", "encontráis", "encuentran"],
                  "subjuntivo presente": ["encuentre", "encuentres", "encuentre", "encontremos", "encontréis", "encuentren"]},
    "almorzar": {"presente": ["almuerzo", "almuerzas", "almuerza", "almorzamos", "almorzáis", "almuerzan"],
                 "pretérito": ["almorcé", "almorzaste", "almorzó", "almorzamos", "almorzasteis", "almorzaron"],
                 "subjuntivo presente": ["almuerce", "almuerces", "almuerce", "almorcemos", "almorcéis", "almuercen"]},
    "recordar": {"presente": ["recuerdo", "recuerdas", "recuerda", "recordamos", "recordáis", "recuerdan"],
                 "subjuntivo presente": ["recuerde", "recuerdes", "recuerde", "recordemos", "recordéis", "recuerden"]},
    "mostrar": {"presente": ["muestro", "muestras", "muestra", "mostramos", "mostráis", "muestran"],
                "subjuntivo presente": ["muestre", "muestres", "muestre", "mostremos", "mostréis", "muestren"]},
    "perder": {"presente": ["pierdo", "pierdes", "pierde", "perdemos", "perdéis", "pierden"],
               "subjuntivo presente": ["pierda", "pierdas", "pierda", "perdamos", "perdáis", "pierdan"]},
    "entender": {"presente": ["entiendo", "entiendes", "entiende", "entendemos", "entendéis", "entienden"],
                 "subjuntivo presente": ["entienda", "entiendas", "entienda", "entendamos", "entendáis", "entiendan"]},
    "empezar_like": {},  # placeholder removed below
}
del IRREGULAR["empezar_like"]

# أنماط مفيدة للإنتاج الموسّع
# zc: yo → zc (conocer-type) — كل صيغ المضارع التام تستخدم جذع zc
ZC_LEMMAS = {"conocer", "parecer", "traducir", "conducir", "producir", "aparecer",
             "crecer", "ofrecer", "padecer", "merecer", "obedecer", "pertenecer",
             "nacer", "crecer", "ejercer", "vencer", "convencer"}
# g: yo ينتهي بـgo (tener-type) — المضارع التام كله بجذع g
YO_G = {"tener", "venir", "poner", "salir", "valer", "caber", "satisfacer"}


def _class(lemma: str) -> str:
    if lemma.endswith("ar"):
        return "ar"
    if lemma.endswith("er"):
        return "er"
    if lemma.endswith("ir") or lemma.endswith("ír"):
        return "ir"
    raise ValueError(f"ليس فعلًا منتظم النهاية: {lemma}")


def _apply_ortho(stem: str, ending: str, cls: str, allow_gj: bool = True) -> str:
    """قواعد الكتابة الإملائية الإسبانية بحسب أول حرف من النهاية."""
    e0 = ending[:1]
    if e0 in "eéií":
        if cls == "ar":
            if stem.endswith("c"):
                return stem[:-1] + "qu" + ending
            if stem.endswith("z"):
                return stem[:-1] + "c" + ending
            if stem.endswith("g") and not stem.endswith("gu"):
                return stem + "u" + ending
        return stem + ending
    if e0 in "aáoóuú":
        if cls in ("er", "ir"):
            if stem.endswith("zc"):
                return stem + ending  # conozc+o ⇒ conozco
            if stem.endswith("gu"):
                return stem[:-1] + ending  # sigu+o ⇒ sigo (gu تفقد u)
            if stem.endswith("qu"):
                return stem[:-2] + "c" + ending
            if allow_gj and stem.endswith("g") and not stem.endswith("gu"):
                return stem[:-1] + "j" + ending
            if stem.endswith("c"):
                return stem[:-1] + "z" + ending
        return stem + ending
    return stem + ending


def _stem_change(stem: str, from_ch: str, to_ch: str) -> str:
    """يغيّر آخر مقطع في الجذر فقط (cerrar→cierro، pero comer→como لا يُمس)."""
    idx = stem.rfind(from_ch)
    if idx < 0:
        return stem
    # فقط إذا كان التغيير في المقطع المحمول (تقريب: إذا كان بعد آخر حرف متحرك)
    rest = stem[idx + 1:]
    # gu/qu ليست مقطعًا متحركًا: u بعدها g/q ساكنة
    rest_test = rest.replace("gu", "g").replace("qu", "q")
    if any(c in "aeiouáéíóúü" for c in rest_test):
        return stem  # التغيير ليس في المقطع المحمول — لا نلمسه
    return stem[:idx] + to_ch + rest


def conjugate(lemma: str, paradigm: str = "") -> list[dict]:
    """يعيد قائمة أشكال [{kind, formEs, tense, mood, person, irregular}]"""
    cls = _class(lemma)
    stem = lemma[:-2]
    forms: list[dict] = []
    irregular_lemma = lemma in IRREGULAR or paradigm in ("irreg",)
    change = paradigm if paradigm in STEM_CHANGE else ""
    from_ch, to_ch = STEM_CHANGE.get(change, ("", ""))

    def add(tense, mood, seq, irr=False):
        for person, form in zip(PERSONS, seq):
            forms.append({"kind": "conjugation", "formEs": form, "tense": tense, "mood": mood,
                          "person": person, "irregular": bool(irr or irregular_lemma)})

    table = IRREGULAR.get(lemma, {})
    allow_gj = not lemma.endswith("guir")

    def ortho(s: str, ending: str) -> str:
        return _apply_ortho(s, ending, cls, allow_gj=allow_gj)

    for tense in ("presente", "pretérito", "imperfecto", "futuro", "condicional"):
        mood = "indicativo"
        if tense in table:
            seq = table[tense]
            add(tense, mood, seq, irr=True)
            continue
        if tense == "presente":
            for i, (person, ending) in enumerate(zip(PERSONS, ENDINGS[tense][cls])):
                s = stem
                irr = False
                if change and i not in (3, 4):
                    s2 = _stem_change(s, from_ch, to_ch)
                    if s2 != s:
                        s, irr = s2, True
                if lemma in ZC_LEMMAS and i == 0:
                    s = (stem[:-1] + "zc") if stem.endswith("c") else (stem + "zc")
                    irr = True
                elif lemma in YO_G and i == 0:
                    s = stem + "g"
                    irr = True
                form = ortho(s, ending)
                forms.append({"kind": "conjugation", "formEs": form, "tense": tense, "mood": mood,
                              "person": person, "irregular": bool(irr)})
            continue
        if tense == "futuro":
            base = lemma
            FUT_STEMS = {"tener": "tendr", "venir": "vendr", "poner": "pondr", "salir": "saldr",
                         "valer": "valdr", "hacer": "har", "poder": "podr", "saber": "sabr",
                         "caber": "cabr", "querer": "querr", "decir": "dir", "haber": "habr", "ir": "ir"}
            base = FUT_STEMS.get(lemma, lemma)
            seq = [base + e for e in ENDINGS[tense][cls]]
            add(tense, mood, seq, irr=lemma in FUT_STEMS)
            continue
        if tense == "condicional":
            base = lemma
            FUT_STEMS = {"tener": "tendr", "venir": "vendr", "poner": "pondr", "salir": "saldr",
                         "valer": "valdr", "hacer": "har", "poder": "podr", "saber": "sabr",
                         "caber": "cabr", "querer": "querr", "decir": "dir", "haber": "habr", "ir": "ir"}
            base = FUT_STEMS.get(lemma, lemma)
            seq = [base + e for e in ENDINGS[tense][cls]]
            add(tense, mood, seq, irr=lemma in FUT_STEMS)
            continue
        # imperfecto / pretérito افتراضيًا منتظمان هنا (الشاذ جاهز في IRREGULAR)
        seq = [ortho(stem, ending) for ending in ENDINGS[tense][cls]]
        if tense == "pretérito" and change and cls == "ir":
            # قاعدة الأفعال -ir المتغيرة الجذر: 3s/3p بالمقطع المحمول المتغيّر (mintió، durmió، pidió)
            to_i = "i" if to_ch in ("ie", "i") else ("u" if to_ch == "ue" else to_ch)
            s2 = _stem_change(stem, from_ch, to_i)
            if s2 != stem:
                seq[2] = s2 + "ió"
                seq[5] = s2 + "ieron"
        add(tense, mood, seq)

    # subjuntivo presente
    if "subjuntivo presente" in table:
        add("subjuntivo presente", "subjuntivo", table["subjuntivo presente"], irr=True)
    else:
        yo = None
        for f in forms:
            if f["tense"] == "presente" and f["person"] == "1s":
                yo = f["formEs"]
        if lemma in ZC_LEMMAS:
            base_all = (stem[:-1] + "zc") if stem.endswith("c") else (stem + "zc")
            use_all = True
        elif lemma in YO_G:
            base_all = stem + "g"
            use_all = True
        else:
            base_all = yo[:-1] if yo and yo.endswith("o") else stem
            use_all = False
        seq = []
        for i, ending in enumerate(ENDINGS["subjuntivo presente"][cls]):
            if use_all:
                s = base_all
            else:
                s = base_all if i not in (3, 4) else stem
                if change and cls == "ir" and i in (3, 4):
                    # nosotros/vosotros في -ir المتغيّر: بالجذر المتغيّر (mintamos، durmamos، pidamos)
                    to_i = "i" if to_ch in ("ie", "i") else ("u" if to_ch == "ue" else to_ch)
                    s2 = _stem_change(stem, from_ch, to_i)
                    if s2 != stem:
                        s = s2
            seq.append(ortho(s, ending))
        add("subjuntivo presente", "subjuntivo", seq, irr=use_all or base_all != stem)

    # gerundio
    if "gerundio" in table:
        forms.append({"kind": "gerund", "formEs": table["gerundio"][0], "tense": None, "mood": None,
                      "person": None, "irregular": True})
    else:
        if cls == "ar":
            g = stem + "ando"
        else:
            if stem and stem[-1] in "aeiouáéíóúü":
                g = stem + "yendo"
            else:
                g = stem + "iendo"
                if change and cls == "ir":
                    to_i = "i" if to_ch == "ie" else ("u" if to_ch == "ue" else to_ch)
                    s2 = _stem_change(stem, from_ch, to_i)
                    if s2 != stem:
                        g = s2 + "iendo"
        forms.append({"kind": "gerund", "formEs": g, "tense": None, "mood": None, "person": None,
                      "irregular": bool(change)})

    # participio
    if "participio" in table:
        forms.append({"kind": "participle", "formEs": table["participio"][0], "tense": None, "mood": None,
                      "person": None, "irregular": True})
    else:
        p = stem + ("ado" if cls == "ar" else "ido")
        forms.append({"kind": "participle", "formEs": p, "tense": None, "mood": None, "person": None,
                      "irregular": False})
    return forms


# ------------------------------- IPA ---------------------------------------
VOWELS = "aeiouáéíóúü"

def _stress_syllable(word: str) -> int:
    """إعادة موضع المقطع المحمول (عدّ من المقاطع)."""
    # نقسم بسيطًا: مقطع = حرف متحرك + ما تلاه من الساكنات
    w = word.lower()
    sylls = []
    cur = ""
    for ch in w:
        cur += ch
        if ch in VOWELS:
            sylls.append(cur)
            cur = ""
    if cur:
        if not sylls:
            sylls = [cur]
        else:
            sylls[-1] += cur
    if not sylls:
        return 0
    # لَفظة مع acento: المقطع الذي يحمله محمول
    for i, s in enumerate(sylls):
        if any(c in "áéíóú" for c in s):
            return i
    # بلا لَفظة: الصف/الثلاثي
    if w.endswith(("n", "s")) or (w[-1] in VOWELS and not w.endswith("n")):
        return max(len(sylls) - 2, 0)
    return len(sylls) - 1


def ipa_es(word: str) -> str:
    """تقريب إملاء→IPA (إسبانية أوروبية). موثّق كتقريب قابل للمراجعة."""
    w = word.lower().strip()
    out: list[tuple[str, str]] = []  # (ipa_chunk, is_vowel)
    i = 0
    n = len(w)
    while i < n:
        ch = w[i]
        nxt = w[i + 1] if i + 1 < n else ""
        if ch == "c":
            if nxt in "eéií":
                out.append(("θ", False))
            else:
                out.append(("k", False))
        elif ch == "z":
            out.append(("θ", False))
        elif ch == "q":
            out.append(("k", False)); i += 1  # qu
            continue
        elif ch == "g":
            if nxt in "eéií":
                out.append(("x", False))
            elif nxt == "u" and i + 2 < n and w[i + 2] in "eéií":
                out.append(("g", False)); i += 1  # gu
                continue
            else:
                out.append(("g", False))
        elif ch == "j":
            out.append(("x", False))
        elif ch == "x":
            out.append(("k", False)); out.append(("s", False))
        elif ch == "h":
            pass  # صامت
        elif ch == "y":
            if nxt == "":
                out.append(("i", True))
            else:
                out.append(("ʝ", False))
        elif ch == "w":
            out.append(("w", False))
        elif ch == "ñ":
            out.append(("ɲ", False))
        elif ch == "r":
            if i == 0 or w[i - 1] in "nls":
                out.append(("r", False))
            else:
                out.append(("ɾ", False))
        elif ch == "b":
            out.append(("b", False))
        elif ch == "v":
            out.append(("b", False))
        elif ch == "d":
            out.append(("d", False))
        elif ch == "f":
            out.append(("f", False))
        elif ch == "k":
            out.append(("k", False))
        elif ch == "l":
            if nxt == "l":
                out.append(("ʎ", False)); i += 1
                continue
            out.append(("l", False))
        elif ch == "m":
            out.append(("m", False))
        elif ch == "n":
            out.append(("n", False))
        elif ch == "p":
            out.append(("p", False))
        elif ch == "s":
            out.append(("s", False))
        elif ch == "t":
            out.append(("t", False))
        elif ch == "u":
            out.append(("u", True))
        elif ch == "ü":
            out.append(("u", True))
        elif ch in "áéíóú":
            out.append((ch.translate(str.maketrans("áéíóú", "aeiou")), True))
        elif ch in "aeio":
            out.append((ch, True))
        elif ch == " ":
            out.append((" ", False))
        else:
            out.append((ch, False))
        i += 1

    # النبر: نحدد الفهرس ثم نضع ˈ قبل أول حرف من المقطع المحمول
    letters = [c for c, _ in out]
    # حساب النبر على الكلمة الأولى فقط (العبارات تُنبرّ كلمة كلمة — نبسط)
    first = w.split(" ")[0]
    syl_idx = _stress_syllable(first)
    # جمع حدود المقاطع في الناتج (تقريب على مستوى الحروف)
    vowel_positions = [k for k, (c, is_v) in enumerate(out) if is_v]
    if vowel_positions:
        target_vowel = min(syl_idx, len(vowel_positions) - 1)
        pos = vowel_positions[target_vowel]
        # نضع علامة النبر قبل المقطع: أقرب بداية (متحرك أو مجموعته)
        out.insert(pos, ("ˈ", False))
    body = "".join(c for c, _ in out)
    # تنظيف: لا مسافات مزدوجة
    body = body.replace("  ", " ").strip()
    return f"/{body}/"


def hint_ar(word: str) -> str:
    """تقريب النطق بالعربية (مذكور في كل حزمة أنه تقريب فقط)."""
    ipa = ipa_es(word).strip("/")
    MAP = {
        "θ": "ث", "x": "خ", "ʝ": "ي", "ʎ": "لي", "ɲ": "ني", "ɾ": "ر", "r": "ر",
        "b": "ب", "d": "د", "f": "ف", "g": "ج", "k": "ك", "l": "ل", "m": "م",
        "n": "ن", "p": "ب", "s": "س", "t": "ت", "w": "و", "u": "و", "o": "و",
        "a": "ا", "e": "ي", "i": "ي", "j": "ي", "ˈ": "", " ": " ", "ː": "",
    }
    return "".join(MAP.get(ch, "") for ch in ipa).strip()


def noun_plural(lemma: str, gender: str | None) -> str | None:
    if " " in lemma:
        return None  # عبارات: لا نولّد جمعًا آليًا
    w = lemma
    if w.endswith(("s", "x")):
        return w
    if w.endswith("z"):
        return w[:-1] + "ces"
    if w.endswith("ón"):
        return w[:-3] + "ones"
    if w.endswith("és"):
        return w[:-2] + "eses"
    if w[-1] in "aeiouáéíóú":
        return w + "s"
    if w.endswith("c"):
        return w[:-1] + "ques"
    if w.endswith("g"):
        return w + "ues"
    return w + "es"
