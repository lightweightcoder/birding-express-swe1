CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    date TEXT,
    flock_size INTEGER,
    user_id INTEGER,
    species_id INTEGER
);

CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT, password TEXT);

CREATE TABLE IF NOT EXISTS species (
    id SERIAL PRIMARY KEY,
    name TEXT,
    scientific_name TEXT
);

CREATE TABLE IF NOT EXISTS note_behaviours (id SERIAL PRIMARY KEY, note_id INTEGER, behaviour_id INTEGER);

CREATE TABLE IF NOT EXISTS behaviours (id SERIAL PRIMARY KEY, name TEXT);

CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, note_id INTEGER, user_id INTEGER, description TEXT);