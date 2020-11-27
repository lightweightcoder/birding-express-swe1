ALTER TABLE notes ADD COLUMN species_id INTEGER;

UPDATE notes SET species_id=1 WHERE id=1;

SELECT notes.date, notes.behaviour, notes.flock_size, species.name AS species_name FROM notes INNER JOIN species ON notes.species_id = species.id;

UPDATE notes SET behaviour_id=4 WHERE id=7;

ALTER TABLE notes DROP COLUMN behaviour_id;

SELECT * FROM comments WHERE note_id=$1

DELETE FROM comments WHERE id=2;