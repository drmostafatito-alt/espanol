# -*- coding: utf-8 -*-
"""مزامنة خريطة المنهج مع ملفات المحتوى الفعلية:
- يضيف الدروس الجديدة إلى وحداتها (الحقول: slug/titleAr/objectiveAr/status/vocabPack/requires).
- يحدّث حالة الدروس المكتوبة، ويضيف حزم المفردات للوحدات.
لا يغيّر الأعداد المخطّطة ولا يخلق ادعاءات تغطية.
"""
import json, glob, os

MAP = 'content/curriculum/curriculum-map.v1.json'
map_doc = json.load(open(MAP))

def unit_of(track_slug, unit_slug):
    for t in map_doc['tracks']:
        if t['slug'] != track_slug:
            continue
        for lev in t['levels']:
            for u in lev.get('units', []):
                if u['slug'] == unit_slug:
                    return u
    raise SystemExit(f'unit not found: {track_slug}/{unit_slug}')

files = sorted(glob.glob('content/drafts/**/lesson-*.json', recursive=True))
added = 0
for f in files:
    L = json.load(open(f))['lesson']
    u = unit_of(L['programSlug'], L['unitSlug'])
    u.setdefault('lessons', [])
    existing = next((x for x in u['lessons'] if x['slug'] == L['slug']), None)
    seq = [L['slug']]
    # ترتيب الدروس من paths.json لضبط requires
    paths = json.load(open(os.path.join(os.path.dirname(f), 'paths.json')))
    for p in paths['programs']:
        for pu in p['units']:
            if pu['slug'] == L['unitSlug']:
                seq = pu['lessons']
    idx = seq.index(L['slug'])
    entry = {
        "slug": L['slug'],
        "titleAr": L['titleAr'],
        "objectiveAr": L['objectiveAr'],
        "status": "authored",
        "filePath": f,
        "vocabPack": (u.get('vocabularyBundles') or [None])[0],
        "skills": L.get("skills", []),
        "requires": [seq[idx - 1]] if idx > 0 else [],
    }
    if existing:
        existing.update(entry)
    else:
        u['lessons'].append(entry)
        added += 1

# حزم المفردات: تسجيلها في وحداتها (بلا تغيير الأعداد)
for t in map_doc['tracks']:
    for lev in t['levels']:
        for u in lev.get('units', []):
            if u.get('lessons'):
                packs = []
                for l in u['lessons']:
                    if l.get('vocabPack') and l['vocabPack'] not in packs:
                        packs.append(l['vocabPack'])
                if packs:
                    u['vocabularyBundles'] = packs

json.dump(map_doc, open(MAP, 'w'), ensure_ascii=False, indent=2)
open(MAP, 'a').write("\n")
print('lessons added to map:', added)
