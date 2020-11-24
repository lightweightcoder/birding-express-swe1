CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    date TEXT,
    behaviour TEXT,
    flock_size INTEGER
);
CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT, password TEXT);

CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    name TEXT,
    scientific_name TEXT
);