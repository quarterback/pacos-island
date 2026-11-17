"""Turn Wikidata exports (label~sitelinks;...) into angle blocks for js/data.js.

Sitelinks (how many Wikipedias have a page on the item) stand in for how
familiar an answer is: tier 1 at 55 or more, 2 at 40, 3 at 25, 4 at 12, else 5.
Usage: python3 tools/mine/wikidata_to_angles.py > /tmp/angles_wd.js
"""
import re, sys, os

HERE = os.path.dirname(__file__)

def tier(sl):
    return 1 if sl >= 55 else 2 if sl >= 40 else 3 if sl >= 25 else 4 if sl >= 12 else 5

def read(path):
    out, key = {}, None
    for line in open(os.path.join(HERE, path), encoding='utf-8'):
        line = line.strip()
        if not line: continue
        if line.startswith('#'): key = line[1:]; out[key] = []; continue
        for part in line.split(';'):
            if '~' not in part: continue
            name, sl = part.rsplit('~', 1)
            out[key].append((name.strip(), int(sl)))
    return out

def aliases(name, people, all_names):
    al = []
    if people:
        last = name.split()[-1]
        if sum(1 for n in all_names if n.split()[-1] == last) == 1 and len(last) > 3:
            al.append(last)
    else:
        if name.startswith('The '): pass  # the game's matcher drops a leading "The"
        if ':' in name: al.append(name.split(':')[0])
        al.append(name.replace('&', 'and')) if '&' in name else None
        if name.endswith('!'): al.append(name[:-1])
    seen = set(); return [a for a in al if a and a != name and not (a in seen or seen.add(a))]

def block(id_, subject, shape, text, items, people):
    names = [n for n, _ in items]
    # dedupe, keep the highest sitelinks
    best = {}
    for n, sl in items: best[n] = max(sl, best.get(n, 0))
    lines = []
    for n, sl in sorted(best.items(), key=lambda x: -x[1]):
        al = aliases(n, people, names)
        lines.append(f"{tier(sl)} " + '|'.join([n] + al))
    body = '\n'.join(lines)
    text = text.replace("'", "\\'")
    return f"    angle('{id_}', '{subject}', '{shape}', '{text}', `\n{body}`),"

FILMS = {
    'Tom Hanks': ('hanks_movies', 'Name a movie starring Tom Hanks.'),
    'Julia Roberts': ('roberts_movies', 'Name a movie starring Julia Roberts.'),
    'Meryl Streep': ('streep_movies', 'Name a movie starring Meryl Streep.'),
    'Sandra Bullock': ('bullock_movies', 'Name a movie starring Sandra Bullock.'),
    'Denzel Washington': ('denzel_movies', 'Name a movie starring Denzel Washington.'),
    'Will Smith': ('will_smith_movies', 'Name a movie starring Will Smith.'),
    'Leonardo DiCaprio': ('dicaprio_movies', 'Name a movie starring Leonardo DiCaprio.'),
    'Reese Witherspoon': ('witherspoon_movies', 'Name a movie starring Reese Witherspoon.'),
    'Jennifer Aniston': ('aniston_movies', 'Name a movie starring Jennifer Aniston.'),
    'Adam Sandler': ('sandler_movies', 'Name a movie starring Adam Sandler.'),
}
AWARDS = {
    'best_actress': ('best_actress', 'awards', 'people', 'Name an actress who won the Oscar for best actress.', True),
    'best_actor': ('best_actor', 'awards', 'people', 'Name an actor who won the Oscar for best actor.', True),
    'supporting_actress': ('supporting_actress', 'awards', 'people', 'Name a winner of the Oscar for best supporting actress.', True),
    'animated_feature': ('animated_oscar', 'awards', 'crossover', 'Name a movie that won the Oscar for best animated feature.', False),
}
out = []
for actor, items in read('wikidata_films.txt').items():
    id_, text = FILMS[actor]
    out.append(block(id_, 'movies', 'people', text, items, False))
for key, items in read('wikidata_awards.txt').items():
    id_, subject, shape, text, people = AWARDS[key]
    out.append(block(id_, subject, shape, text, items, people))
print('\n'.join(out))
