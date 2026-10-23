# -*- coding: utf-8 -*-
"""إضافة تصريفات المضارع للأفعال في حزم المفردات (بشري المنشأ، لا توليد آلي للصيغ)."""
import json, glob
PRESENT = {
 "estar": ["estoy","estás","está","estamos","estáis","están"],
 "tener": ["tengo","tienes","tiene","tenemos","tenéis","tienen"],
 "ir": ["voy","vas","va","vamos","vais","van"],
 "hacer": ["hago","haces","hace","hacemos","hacéis","hacen"],
 "querer": ["quiero","quieres","quiere","queremos","queréis","quieren"],
 "poder": ["puedo","puedes","puede","podemos","podéis","pueden"],
 "saber": ["sé","sabes","sabe","sabemos","sabéis","saben"],
 "ver": ["veo","ves","ve","vemos","veis","ven"],
 "decir": ["digo","dices","dice","decimos","decís","dicen"],
 "venir": ["vengo","vienes","viene","venimos","venís","vienen"],
 "dar": ["doy","das","da","damos","dais","dan"],
 "poner": ["pongo","pones","pone","ponemos","ponéis","ponen"],
 "salir": ["salgo","sales","sale","salimos","salís","salen"],
 "llegar": ["llego","llegas","llega","llegamos","llegáis","llegan"],
 "comprar": ["compro","compras","compra","compramos","compráis","compran"],
 "comer": ["como","comes","come","comemos","coméis","comen"],
 "beber": ["bebo","bebes","bebe","bebemos","bebéis","beben"],
 "vivir": ["vivo","vives","vive","vivimos","vivís","viven"],
}
PERSONS = ["1s","2s","3s","1p","2p","3p"]
IRREGULAR = {"estar","tener","ir","hacer","querer","poder","saber","ver","decir","venir","dar","poner","salir"}
added = 0
for f in glob.glob('content/drafts/**/vocab-*.json', recursive=True):
    d = json.load(open(f)); changed = False
    for e in d['entries']:
        n = e['normalized']
        if n in PRESENT and not e.get('forms'):
            e['forms'] = [{"kind": "conjugation", "formEs": form, "tense": "presente", "mood": "indicativo",
                           "person": PERSONS[i], "irregular": n in IRREGULAR} for i, form in enumerate(PRESENT[n])]
            changed = True; added += 1
    if changed:
        json.dump(d, open(f, 'w'), ensure_ascii=False, indent=2); open(f, 'a').write("\n")
print('forms added to', added, 'entries')
