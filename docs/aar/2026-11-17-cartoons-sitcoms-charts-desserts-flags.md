# Cartoons, sitcoms, charts, desserts, flags and animals

## What Ron asked for

More questions from cartoons, sitcoms, TV, music charts, desserts and national flag colors, plus the ProtoQA survey bank. While the batch was underway he also asked for "Name a bird" (any bird, Big Bird to snowy egret), "Name a fish" and invertebrates.

## What changed

86 new whole questions, all written or checked by hand.

- **Cartoons (15):** "The Simpsons," Looney Tunes, Hanna-Barbera, Bikini Bottom, Smurfs, Winnie the Pooh's friends, Mickey Mouse's friends, My Little Pony, "Bluey," Disney songs, DreamWorks movies, cartoon mice, comic strip animals, animated shows for grown-ups and Saturday morning cartoons.
- **Sitcoms (6):** one question each for the 1970s, 1980s, 1990s, 2000s and 2010s, plus sitcom families.
- **TV (6):** shows set in Chicago, HBO series, Netflix originals, PBS shows, shows with a woman's name in the title and famous TV and movie cops.
- **Music (15):**
  - No. 1 hits by Mariah Carey, Michael Jackson, Madonna, Whitney Houston, Rihanna, Beyoncé and Elvis Presley
  - Elvis movies
  - 1960s rock bands and 1980s bands
  - female pop stars and classical composers
  - instruments you play with your mouth
  - songs with their own dance
- **Desserts and snacks (10):** frozen desserts, French desserts, Italian desserts, doughnuts, chocolate desserts, fruit desserts, pudding flavors, candy in lots of colors, potato chip flavors and snacks with cream in the middle.
- **Flags (5):** red, white and blue; green, yellow and red; a cross; a crescent moon; an animal.
- **Animals (3):** birds, fish and animals with no backbone. Each takes real animals plus famous fictional ones (Big Bird, Tweety, Nemo, Dory).
- **From ProtoQA prompts (26):**
  - Old West outlaws, famous robots, movie studios and New York City streets
  - famous Dans, Kates and Matts, and famous Careys, Carries and Kerrys
  - things on a front lawn
  - animals: big cats, animals with horns, animals with whiskers, desert animals and flying insects
  - trees with fall colors, and flowers that are also girls' names
  - sports: boats with no engine, sports with helmets, water sports and sports with a net
  - holidays ending in "Day"
  - movies: masked characters, horse movies, baseball movies, movies with "king" in the title, space movies and wedding movies

A hand-written question can now hold up to 400 answers. The cap was 100, which had dropped birds, fish, HBO, Netflix and five more lists.

## Mistakes caught before merging

- The drafts had lines ending in "?" where I wasn't sure of an answer, and long lists marked most answers tier 2. A cleanup script (`/home/claude/clean_angles.py`) did four things:
  - dropped every unsure line
  - removed duplicate answers
  - capped how easy an answer can be by its place in the list
  - removed known wrong entries (golf in sports with a net, shrimp in animals with whiskers, "Hidden Figures" in space movies)
- "Material Girl" never reached No. 1, so it is out of the Madonna list.
- Five answers gave themselves away in the question ("The Band," "Robot," "Carrie," "The Mask," "The King"), so they were removed or renamed.
- The Chicago TV list had shows set elsewhere ("Mr. Belvedere," "Empire," "Leverage," "The Bernie Mac Show"), so they were removed.
- `tools/copy-export.mjs` broke on the new date function from the share change and now skips it.

## Result

- 1,074 questions in the pool, with 496 that new rounds can deal, 449 of them whole questions.
- In Paco's mode the first repeat comes on day 57, up from 47 after the letter cut.
- `node tools/check.mjs` shows 0 problems, and `js/rarity.js` was rebuilt with 16,652 answers.
- prosekeep found nothing. plain-language-default flagged only the export running questions together. red-pen-editor flagged the cop and robot questions for sharing a template, which is intended.

## Still open

- About 250 more whole questions would push the first repeat past four months.
- Any answer a player reports as wrongly refused gets added the same day.
