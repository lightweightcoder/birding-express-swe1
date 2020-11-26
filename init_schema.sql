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


INSERT INTO species (name, scientific_name) VALUES ('Cinnamon Bittern', 'Ixobrychus cinnamomeus');

INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (7, 4);

INSERT INTO behaviours (name) VALUES ('walking');

ALTER TABLE notes ADD COLUMN species_id INTEGER;

UPDATE notes SET species_id=1 WHERE id=1;

SELECT notes.date, notes.behaviour, notes.flock_size, species.name AS species_name FROM notes INNER JOIN species ON notes.species_id = species.id;

UPDATE notes SET behaviour_id=4 WHERE id=7;

ALTER TABLE notes DROP COLUMN behaviour_id;
