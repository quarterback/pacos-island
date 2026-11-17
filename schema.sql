-- One row per player per question. Run once in the D1 console.
CREATE TABLE IF NOT EXISTS picks (
  day INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  player TEXT NOT NULL,
  answer TEXT NOT NULL,
  at INTEGER NOT NULL,
  PRIMARY KEY (day, prompt, player)
);
CREATE INDEX IF NOT EXISTS picks_by_question ON picks (day, prompt, answer);
