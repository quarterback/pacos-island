"""Build js/rarity.js: a fixed familiarity score for every answer.

Run: pip install wordfreq, then python3 tools/rarity.py

A score is on the Zipf scale: about 5 for a name people see every day,
about 2 for one they almost never see. Scores never change with play.

- Countries, world capitals, US and Mexican states, elements and presidents: 60% from how often the name appears
  in English text (the wordfreq package, which combines Wikipedia, news,
  books, subtitles and the web), 40% from the hand tier in js/data.js. The
  tier steadies names that are also common words or surnames, like Lead,
  Chad, Georgia, Hidalgo or Grant.
- Team nicknames, state capitals, constellations, Greek letters, the NATO
  alphabet and books of the Bible: the hand tier alone. Their names are
  common words or names (Heat, Jackson, Leo, Eta, Golf, Mark), so their
  frequency in text says little about the answer.

Tiers map to the same scale: 1 = 5.0, 2 = 4.2, 3 = 3.4, 4 = 2.6, 5 = 1.8.
"""
import json, subprocess, pathlib
from wordfreq import zipf_frequency

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIER = {1: 5.0, 2: 4.2, 3: 3.4, 4: 2.6, 5: 1.8}
TEXT_SHARE = 0.6
# Lists scored by hand tier alone, because their names are common words or
# names in ordinary text (Heat, Jackson, Leo, Eta, Golf, Mark).
TIER_ONLY = {"nba", "nfl", "mlb", "nhl", "statecaps", "constellations", "greek", "nato", "bible",
             # titles, characters and everyday words, where text frequency
             # measures the word more than the answer
             "bestpicture", "pixar", "bond", "princesses", "starwars", "friends", "avengers", "swift", "beatles",
             "thriller", "potter", "narnia", "austen", "shakespeare", "planets", "continents", "rainbow", "dwarfs",
             "reindeer", "chess", "wonders", "monopoly", "cluesuspects", "clueweapons", "cluerooms", "rubik", "poker",
             "bts", "henry", "olympians", "premier", "ucl", "pwhl", "nwsl", "mlv",
             "housewives", "kardashians", "sharks", "idol", "tools", "pasta", "citrus", "cheese", "wine",
             "dahl", "littlehouse", "dickens", "bronte", "littlewomen", "bennets", "hungergames", "spice", "destinys",
             "lloydwebber", "soundofmusic", "grease", "bridgerton", "peanuts", "oz", "tudors", "birthstones",
             "herbs", "spices", "apples", "squash", "starbucks"}
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
        score = tier if universe in TIER_ONLY or universe.startswith("a_") else TEXT_SHARE * text_score(universe, it) + (1 - TEXT_SHARE) * tier
        out[universe][it["name"]] = round(score, 2)

lines = ["/* Paco's Island: fixed familiarity scores, built by tools/rarity.py. Do not edit by hand.",
         "   About 5 for a name people see every day, about 2 for one they almost never see. */",
         "'use strict';", "const Rarity = {"]
for universe, scores in out.items():
    lines.append(f"  {universe}: {json.dumps(scores, ensure_ascii=False, separators=(', ', ': '))},")
lines += ["};", "if (typeof module !== 'undefined') module.exports = Rarity;", ""]
(ROOT / "js" / "rarity.js").write_text("\n".join(lines))
print("wrote js/rarity.js:", sum(len(v) for v in out.values()), "answers")
