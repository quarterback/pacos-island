# After action record: easier questions, pop culture and Carlos's mode

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

Testers said the questions were too hard. The owner asked for:

- Pop culture and everyday topics most people know: movies, music, songs, awards, charts, books, authors, board games, puzzles and famous people.
- Team questions that ask for a city in place of a nickname, with nickname questions kept.
- Acronyms spelled out on first use.
- Teams from around the world.
- An adjustable level: Paco's mode, plus an easier Carlos's mode (Carlos is Paco's iguana twin brother and rival), with scoring indexed to the level and a suggestion to try Carlos's mode after a bad round.

The owner chose easy questions plus 35 seconds for Carlos's mode, and half points.

## 2. Action

- **New lists (39):**
  - teams by place in the NFL, NBA, MLB and NHL
  - men's World Cup winners
  - Champions League and European Cup winners
  - this season's Premier League clubs
  - Summer Olympic host cities
  - Best Picture winners
  - Pixar films
  - James Bond films
  - official Disney princesses
  - Star Wars saga films
  - Friends characters
  - the original Avengers
  - the seven dwarfs
  - Taylor Swift albums
  - Beatles U.S. No. 1 songs
  - songs on Thriller
  - BTS members
  - Harry Potter books
  - Narnia books
  - Jane Austen novels
  - Shakespeare plays
  - planets, continents and rainbow colors
  - Santa's reindeer
  - chess pieces
  - the Seven Wonders of the Ancient World
  - Monopoly properties
  - Clue suspects, weapons and rooms
  - Rubik's Cube colors
  - poker hands
  - the Olympian gods
  - Henry VIII's wives
  - faces on U.S. paper money
- **Sources:** lists that change were checked before use:
  - the 2026 Best Picture winner, One Battle After Another
  - Spain's 2026 World Cup win
  - Paris Saint-Germain's 2026 Champions League win
  - the 2026–27 Premier League clubs, with Coventry City, Ipswich Town and Hull City promoted
  - the Pixar slate through Toy Story 5
  - Taylor Swift's 12 studio albums
  - the 13 official Disney princesses
- **Scores:** the new lists use hand tiers, because titles and character names are common words. The 1,625 answers were rescored.
- **Teams:** city questions ("Name a city or state with a National Football League (NFL) team") with other common names accepted, such as Phoenix for Arizona or Boston for New England. Nickname questions now accept full team names ("Dallas Cowboys").
- **Acronyms:** league names are spelled out on first use. Cross-league questions name the sports. The NATO alphabet is described as the phonetic alphabet pilots use. AGENTS.md now has the rule.
- **Openers:** only "starts with" and "has the letter" rules can open a set.
- **Pool:** 945 questions, 125 of them openers.
- **Levels:**
  - The title screen offers Paco's mode or Carlos's mode. Each level has its own daily set.
  - Carlos's sets have two openers and five easy questions, with no letter counting.
  - Carlos's mode gives 35 seconds per question and halves every score.
  - Carlos is drawn as Paco's twin in teal with a red cap, takes the trips in his mode, and is named in the headline and share line.
  - After a Paco's mode set under 12,000 points, or with three or more unanswered questions, the end screen suggests Carlos's mode.

## 3. Checks

- `node tools/check.mjs`: 945 questions, 125 openers, 0 problems, with alias collision and self-match checks run on every new list.
- In headless Chrome, a Paco's mode daily set scored 10,486 and showed the suggestion. Following it opened Carlos's mode with his intro. His set started a 35 second clock, paid half points, ended on "Carlos got you to the Ixtaluz pier." and shared as "day 1, Carlos's mode." There were no page errors.
- prosekeep flagged only the two known "Testament" false positives. plain-language-default flagged only lines the export joins without punctuation.

## 4. Gaps

- The other new lists were written from knowledge and checked by count. A fact check before launch would cover the Beatles No. 1 songs and the Shakespeare canon. Shakespeare follows the common 38 play canon, with the parts of Henry IV and Henry VI merged.
- Ease still measures how well known the answers are, not how hard the rule is to apply. Openers and Carlos's sets avoid the hardest rules to make up for it.
