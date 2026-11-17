# ConceptNet seeds for everyday questions

ConceptNet (conceptnet.io) is CC BY-SA 4.0. Its public API was down when this was run, so the seeds came from the 100,000-fact sample published with Li et al., "Commonsense Knowledge Base Completion" (home.ttic.edu/~kgimpel/commonsense.html, `train100k.txt.gz`), loaded in a browser and grouped in place:

```js
const r = await fetch('comsense_resources/train100k.txt.gz');
const txt = await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text();
const g = {};
for (const l of txt.split('\n')) { const [rel, h, t] = l.split('\t'); if (rel === 'AtLocation' && t) (g[t] ||= new Set()).add(h); }
```

The `AtLocation` groups with the most members (kitchen, bathroom, garage, desk, office, movie theater, beach, refrigerator, closet, park, zoo, airport and others) became prompts like "Name something you'd find in a kitchen."

The raw data is noisy: words are stemmed ("clothe," "plumb"), and some entries are offensive. Use it only to pick prompts and to jog memory. Write every answer list by hand.
