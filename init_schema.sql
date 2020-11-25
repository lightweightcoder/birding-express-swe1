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

INSERT INTO species (name, scientific_name) VALUES ('Cinnamon Bittern', 'Ixobrychus cinnamomeus');

ALTER TABLE notes ADD COLUMN species_id INTEGER;

UPDATE notes SET species_id=1 WHERE id=1;