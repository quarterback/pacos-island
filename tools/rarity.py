"""Build js/rarity.js: a fixed familiarity score for every answer.

Run: pip install wordfreq, then python3 tools/rarity.py

A score is on the Zipf scale: about 5 for a name people see every day,
about 2 for one they almost never see. Scores never change with play.

- Place names, elements and presidents: 60% from how often the name appears
  in English text (the wordfreq package, which combines Wikipedia, news,
  books, subtitles and the web), 40% from the hand tier in js/data.js. The
  tier steadies names that are also common words or surnames, like Lead,
  Chad, Georgia, Hidalgo or Grant.
- Team nicknames: the hand tier alone. Nicknames are common words (Heat,
  Wild, Stars), so their frequency in text says nothing about the team.

Tiers map to the same scale: 1 = 5.0, 2 = 4.2, 3 = 3.4, 4 = 2.6, 5 = 1.8.
"""
import json, subprocess, pathlib
from wordfreq import zipf_frequency

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIER = {1: 5.0, 2: 4.2, 3: 3.4, 4: 2.6, 5: 1.8}
TEXT_SHARE = 0.6
TEAMS = {"nba", "nfl", "mlb", "nhl"}
# Surnames alone are common words or shared by several people, so presidents
# are looked up by full name. Shared surnames take the best known holder.
FULL = {
    "Washington": "George Washington", "Adams": "John Adams", "Jefferson": "Thomas Jefferson",
    "Madison": "James Madison", "Monroe": "James Monroe", "Jackson": "Andrew Jackson",
    "Van Buren": "Martin Van Buren", "Harrison": "William Henry Harrison", "Tyler": "John Tyler",
    "Polk": "James K. Polk", "Taylor": "Zachary Taylor", "Fillmore": "Millard Fillmore",
    "Pierce": "Franklin Pierce", "Buchanan": "James Buchanan", "Lincoln": "Abraham Lincoln",
    "Johnson": "Lyndon Johnson", "Grant": "Ulysses S. Grant", "Hayes": "Rutherford B. Hayes",
    "Garfield": "James Garfield", "Arthur": "Chester Arthur", "Cleveland": "Grover Cleveland",
    "McKinley": "William McKinley", "Roosevelt": "Franklin Roosevelt", "Taft": "William Howard Taft",
    "Wilson": "Woodrow Wilson", "Harding": "Warren Harding", "Coolidge": "Calvin Coolidge",
    "Hoover": "Herbert Hoover", "Truman": "Harry Truman", "Eisenhower": "Dwight Eisenhower",
    "Kennedy": "John F. Kennedy", "Nixon": "Richard Nixon", "Ford": "Gerald Ford",
    "Carter": "Jimmy Carter", "Reagan": "Ronald Reagan", "Bush": "George W. Bush",
    "Clinton": "Bill Clinton", "Obama": "Barack Obama", "Trump": "Donald Trump", "Biden": "Joe Biden",
}

# Places whose display name is not the name English text uses most.
LOOKUP = {"Ciudad de México": ["Mexico City"]}

def text_score(universe, item):
    if universe == "presidents":
        return zipf_frequency(FULL[item["name"]], "en")
    names = item["names"] + LOOKUP.get(item["name"], [])
    return max(zipf_frequency(n, "en") for n in names)

dump = subprocess.run(
    ["node", "-e", "const D=require('./js/data.js');const o={};for(const[k,u]of Object.entries(D.UNIVERSES))o[k]=u.items.map(i=>({name:i.name,names:i.names,aliases:i.aliases,tier:i.tier}));process.stdout.write(JSON.stringify(o))"],
    cwd=ROOT, capture_output=True, text=True, check=True).stdout
out = {}
for universe, items in json.loads(dump).items():
    out[universe] = {}
    for it in items:
        tier = TIER[it["tier"]]
        score = tier if universe in TEAMS else TEXT_SHARE * text_score(universe, it) + (1 - TEXT_SHARE) * tier
        out[universe][it["name"]] = round(score, 2)

lines = ["/* Paco's Island: fixed familiarity scores, built by tools/rarity.py. Do not edit by hand.",
         "   About 5 for a name people see every day, about 2 for one they almost never see. */",
         "'use strict';", "const Rarity = {"]
for universe, scores in out.items():
    lines.append(f"  {universe}: {json.dumps(scores, ensure_ascii=False, separators=(', ', ': '))},")
lines += ["};", "if (typeof module !== 'undefined') module.exports = Rarity;", ""]
(ROOT / "js" / "rarity.js").write_text("\n".join(lines))
print("wrote js/rarity.js:", sum(len(v) for v in out.values()), "answers")
