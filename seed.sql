INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ('01/01/20 01:00', 2, 1, 1);
INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ('02/02/20 01:00', 3, 2, 3);
INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ('03/03/20 01:00', 4, 1, 2);
INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ('04/04/20 01:00', 4, 2, 3);
INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ('05/05/20 01:00', 2, 3, 1);
INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ('06/06/20 01:00', 1, 4, 4);

INSERT INTO users (email, password) VALUES ('user1@gmail.com', 'user1');
INSERT INTO users (email, password) VALUES ('user2@gmail.com', 'user2');
INSERT INTO users (email, password) VALUES ('user3@gmail.com', 'user3');
INSERT INTO users (email, password) VALUES ('user4@gmail.com', 'user4');

INSERT INTO species (name, scientific_name) VALUES ('Wandering Whistling Duck', 'Dendrocygna arcuata');
INSERT INTO species (name, scientific_name) VALUES ('Red Junglefowl', 'Gallus gallus');
INSERT INTO species (name, scientific_name) VALUES ('Little Grebe', 'Tachybaptus ruficollis');
INSERT INTO species (name, scientific_name) VALUES ('Cinnamon Bittern', 'Ixobrychus cinnamomeus');

INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (1, 2);
INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (2, 1);
INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (3, 3);
INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (4, 4);
INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (5, 1);
INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (6, 4);
INSERT INTO note_behaviours (note_id, behaviour_id) VALUES (6, 5);


INSERT INTO behaviours (name) VALUES ('walking');
INSERT INTO behaviours (name) VALUES ('bathing');
INSERT INTO behaviours (name) VALUES ('drinking');
INSERT INTO behaviours (name) VALUES ('flying');
INSERT INTO behaviours (name) VALUES ('hunting');
INSERT INTO behaviours (name) VALUES ('eating');

INSERT INTO comments (note_id, user_id, description) VALUES (1, 2, 'wow!');
INSERT INTO comments (note_id, user_id, description) VALUES (1, 3, 'cool!');
INSERT INTO comments (note_id, user_id, description) VALUES (2, 4, 'nice!');


