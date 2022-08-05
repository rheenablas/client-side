DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
);


DROP TABLE IF EXISTS scoreboard;

CREATE TABLE scoreboard
(
    user_id TEXT,
    score INT,
    kills INT,
    saved INT
);

DROP TABLE IF EXISTS recent;

CREATE TABLE recent
(
    user_id TEXT,
    date DATETIME PRIMARY KEY,
    score INT,
    kills INT,
    saved INT
);

DROP TABLE IF EXISTS kills;

CREATE TABLE kills
(
    user_id TEXT,
    score INT
);

DROP TABLE IF EXISTS saved;

CREATE TABLE saved
(
    user_id TEXT,
    score INT
);
