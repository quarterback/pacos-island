# Question mining

Tools and notes for finding new questions in open data. Read `docs/QUESTION-WRITING.md` first; mined material is raw input, never finished questions.

| Source | License | What it's good for | File |
| --- | --- | --- | --- |
| ProtoQA (Family Feud surveys) | CC BY 4.0 | Everyday prompts and which answers are common | `protoqa_candidates.py` |
| Wikidata | CC0 | Complete, current fact lists with familiarity from sitelinks | `wikidata_queries.md`, `wikidata_to_angles.py` |
| ConceptNet | CC BY-SA 4.0 | "Something you'd find in a ..." prompts | `conceptnet_seeds.md` |
| Open Trivia DB | CC BY-SA 4.0 | Its 24 categories, to spot subjects the pool lacks | none; categories at opentdb.com/api_category.php |

Steps:

1. Pull candidates from a source.
2. Keep prompts with a fair, closed set of answers a regular person could name.
3. Build the full answer list. Use Wikidata for facts; write everyday lists by hand.
4. Set tiers from sitelinks or survey counts.
5. Rewrite the question in house style and tag its subject and kind.
6. Run `python3 tools/rarity.py` and `node tools/check.mjs`, and search anything that may have changed.
