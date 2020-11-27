CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    date TEXT,
    flock_size INTEGER
);

CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT, password TEXT);

CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    name TEXT,
    scientific_name TEXT
);

CREATE TABLE note_behaviours (id SERIAL PRIMARY KEY, note_id INTEGER, behaviour_id INTEGER);

CREATE TABLE behaviours (id SERIAL PRIMARY KEY, name TEXT);

CREATE TABLE comments (id SERIAL PRIMARY KEY, note_id INTEGER, user_id INTEGER);

