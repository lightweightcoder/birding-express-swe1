INSERT INTO species (name, scientific_name) VALUES ('Cinnamon Bittern', 'Ixobrychus cinnamomeus');

INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (7, 4);

INSERT INTO behaviours (name) VALUES ('walking');

INSERT INTO comments (note_id, user_id, description) VALUES (1, 2, 'wow!');

INSERT INTO comments (note_id, user_id, description) VALUES ($1, $2, $3);

