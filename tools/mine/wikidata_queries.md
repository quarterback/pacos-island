# Wikidata queries used for question mining

Wikidata is public domain (CC0). Queries go to https://query.wikidata.org/sparql. The cloud workspace can't reach that host, so these were run from a browser tab on query.wikidata.org with `fetch`, and the results were saved as `label~sitelinks` lists in `wikidata_films.txt` and `wikidata_awards.txt`. `wikidata_to_angles.py` turns those lists into angle blocks for `js/data.js`.

Many items now carry their label in the `mul` language instead of `en`, so take whichever exists:

```sparql
OPTIONAL { ?x rdfs:label ?en . FILTER(LANG(?en)="en") }
OPTIONAL { ?x rdfs:label ?mul . FILTER(LANG(?mul)="mul") }
BIND(COALESCE(?en, ?mul) AS ?l)
```

## Movies an actor appears in

```sparql
SELECT ?f (SAMPLE(?l) AS ?lab) (MAX(?sl) AS ?s) WHERE {
  ?a wdt:P31 wd:Q5 . { ?a rdfs:label "Tom Hanks"@en } UNION { ?a rdfs:label "Tom Hanks"@mul }
  ?f wdt:P161 ?a; wdt:P31/wdt:P279* wd:Q11424; wikibase:sitelinks ?sl .
  # label block above, with ?f
} GROUP BY ?f ORDER BY DESC(?s)
```

Cast lists (P161) miss voice roles, so add animated movies by hand (Toy Story for Tom Hanks).

## People who won an award

```sparql
SELECT ?w (SAMPLE(?l) AS ?lab) (MAX(?sl) AS ?s) WHERE {
  ?aw rdfs:label "Academy Award for Best Actress"@en .
  ?w p:P166 ?st; wdt:P31 wd:Q5 . ?st ps:P166 ?aw .
  ?w wikibase:sitelinks ?sl .
  # label block above, with ?w
} GROUP BY ?w ORDER BY DESC(?s)
```

Drop rows under 10 sitelinks; they are usually data errors.

## Tiers from sitelinks

Sitelinks count how many Wikipedias have a page on the item, a fair stand-in for how familiar it is. `wikidata_to_angles.py` maps 55 or more to tier 1, 40 to tier 2, 25 to tier 3, 12 to tier 4 and fewer to tier 5.
