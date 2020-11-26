import express from 'express';
import methodOverride from 'method-override';
import pg from 'pg';
import cookieParser from 'cookie-parser';
import jsSha from 'jssha';

// SALT is used to hash the userId cookie
// the SALT is a constant value.
// In practice we would not want to store this "secret value" in plain text in our code.
// We will learn methods later in SWE1 to obfuscate this value in our code.
// const SALT = 'bananas are delicious';
// A better way is to store "secret values" in a separate file.
// One such example is the use of enironment variables
const myEnvVar = process.env.MY_ENV_VAR;

// Initialise the DB connection -----------------------------
const { Pool } = pg;
const pgConnectionConfigs = {
  user: process.env.USER, // this user is the computer user that runs this file
  host: 'localhost',
  database: 'birding',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

// Initialise Express ---------------------------
// create an express application
const app = express();
// set the port number
const PORT = 3004;
// set the view engine to ejs
app.set('view engine', 'ejs');
// config to accept request form data
app.use(express.urlencoded({ extended: false }));
// override with POST having ?_method=PUT (in edit.ejs)
app.use(methodOverride('_method'));
// config to allow use of public folder
app.use(express.static('public'));
// config to allow use of cookie parser
app.use(cookieParser());

// routes =============================================================

// start of functionality for user to create a new note by filling up a form ------------

// render the form (note.ejs) that will create the request
app.get('/note', (request, response) => {
  console.log('request to render a new note came in');

  // to verify userId will produce a hash equal to loggedInHash
  // this is to prevent people from just sending a random userId to authenticate themselves --------

  // extract loggedInHash and userId from request cookies
  // if there are such cookies, loggedInHash and userId will have a value of undefined
  const { loggedInHash, userId } = request.cookies;
  // create new SHA object
  const shaObj = new jsSha('SHA-512', 'TEXT', { encoding: 'UTF8' });
  // reconstruct the hashed cookie string
  const unhashedCookieString = `${userId}-${myEnvVar}`;
  // input the unhashed cookie string to the SHA object
  shaObj.update(unhashedCookieString);
  // generate a hashed cookie string using SHA object
  const hashedCookieString = shaObj.getHash('HEX');

  // verify if the generated hashed cookie string matches the request cookie value.
  // if hashed value doesn't match, return 403.
  if (hashedCookieString !== loggedInHash) {
    response.status(403).send('please login <a href="/login">here</a>.');
    return;
  }

  // logic to render the form ------------------------------

  // query the DB for species table
  pool.query('SELECT * FROM species', (speciesError, speciesResult) => {
    if (speciesError) {
      console.log('Error executing select species query', speciesError.stack);
      response.status(503).send(`error 503: service unavilable.<br /> ${speciesResult.rows}`);
      return;
    }

    // query the DB for bahaviours table
    pool.query('SELECT * FROM behaviours', (behaviourError, behaviourResult) => {
      if (behaviourError) {
        console.log('Error executing select species query', behaviourError.stack);
        response.status(503).send(`error 503: service unavilable.<br /> ${behaviourResult.rows}`);
        return;
      }

      // store the species table in an object
      const templateData = {
        species: speciesResult.rows,
        behaviours: behaviourResult.rows,
      };

      // render the form
      response.render('note', templateData);
    });
  });
});

// accept form request and add the new note to the database
// 1st param: the url that the post request is coming from
// 2nd param: callback to execute when post request is made
app.post('/note', (request, response) => {
  console.log('post request of a new note came in');

  // create vars for the date, flockSize, speciesId
  const {
    date, flockSize, speciesId,
  } = request.body;

  // // get the user_id value from the cookie
  const { userId } = request.cookies;

  // set the values to put into the sql query
  const values = [date, flockSize, userId, speciesId];

  // set the sql query
  const sqlQuery = 'INSERT INTO notes (date, flock_size, user_id, species_id) VALUES ($1, $2, $3, $4) RETURNING *';

  // callback function for sql query
  const whenDoneWithQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(`error 503: service unavilable.<br /> ${result.rows}`);
      return;
    }

    // retrieving the note id of the newly created note
    const noteId = result.rows[0].id;

    // write the 2nd sql query to insert values in the note_behaviours relationship table
    const noteBehaviourIdInsertQuery = 'INSERT INTO note_behaviours (note_id, behaviour_id) VALUES ($1, $2)';

    // for each behaviour id we have in the request, make an insert query
    request.body.behaviourIds.forEach((behaviourId, index) => {
      // construct the set of values we are inserting
      const noteBehaviourValues = [noteId, behaviourId];

      // execute the insert query
      pool.query(noteBehaviourIdInsertQuery, noteBehaviourValues, (insertError, insertResult) => {
        if (insertError) {
          console.log('Error executing insert query', insertError.stack);

          response.status(503).send(`error 503: service unavilable.<br /> ${insertResult.rows}`);
          return;
        }

        // all queries are done
        if (index === request.body.behaviourIds.length - 1) {
          console.log('done inserting values into note_behaviours table!');

          // redirect to newly created note
          response.redirect(`/note/${result.rows[0].id}`);
        }
      });
    });
  };

  // execute the sql query to add the new note to database
  pool.query(sqlQuery, values, whenDoneWithQuery);
});

// end of functionality for user to create a new note by filling up a form ----------
// --------------------------------------------------------------------------------------

// start of functionality for user to display a single note -------------------------

app.get('/note/:id', (request, response) => {
  console.log('request to render an existing note came in');

  // get the index param
  const { id } = request.params;

  // set the sql query for an existing note
  const noteQuery = `SELECT * FROM notes WHERE id=${id}`;

  // callback function for sql query
  const whenDoneWithNoteQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(`error 503: service unavilable.<br /> ${result.rows}`);
      return;
    }

    // create a var for the note to display in the webpage
    // note is an object
    const note = result.rows[0];

    // store note in an object
    const templateData = { note };

    // render the form, pass in the template data
    response.render('show-note', templateData);
  };

  // execute the sql query for an exisiting note
  pool.query(noteQuery, whenDoneWithNoteQuery);
});

// end of functionality for user to display a single note -------------------------
// ------------------------------------------------------------------------------------

// start of functionality for user to display a list (all) of notes -----------------

app.get('/', (request, response) => {
  console.log('request to render list of notes came in');

  // set the sql query to extract all notes
  const notesQuery = 'SELECT notes.id, notes.date, notes.flock_size, species.name AS species_name FROM notes INNER JOIN species ON notes.species_id = species.id';

  // callback function for sql query
  const whenDoneWithNotesQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(`error 503: service unavilable.<br /> ${result.rows}`);
      return;
    }

    // create a var for the notes to display in the webpage
    // notes is an array of objects. Each object is a note.
    const notes = result.rows;

    // store note in an object
    const templateData = { notes };

    // render the form, pass in the template data
    response.render('main-page', templateData);
  };

  // execute the sql query for an exisiting note
  pool.query(notesQuery, whenDoneWithNotesQuery);
});

// end of functionality for user to display a list (all) of notes -------------------
// --------------------------------------------------------------------------------------

// start of functionality for user to sign up an account by filling up a form ------------

// render the signup form that will create the request
app.get('/signup', (request, response) => {
  console.log('request to render a sign up form came in');

  response.render('signup');
});

// accept the form request and add the new user to users database
app.post('/signup', (request, response) => {
  console.log('post request of a sign up came in');

  // set the values to put into the sql query
  // in this case there is only 1 value: the sign up email
  const values = [request.body.email];

  // set the sql query to find an email that is the same as the signup email
  const sameEmailQuery = 'SELECT * from users WHERE email=$1';

  // execute the query
  pool.query(sameEmailQuery, values, (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(result.rows);
      return;
    }

    if (result.rows.length >= 1) {
      // found a user with the same email as the sign up email.
      response.status(403).send('sorry this email has already been taken!');
      return;
    }

    // logic to add a new user to the users database

    // set the values to put into the sql query
    const addUserValues = [request.body.email, request.body.password];

    // set the sql query to add the new user into users database
    const addUserQuery = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';

    // execute the query
    pool.query(addUserQuery, addUserValues, (addUserError, addUserResult) => {
      if (addUserError) {
        console.log('error executing query', addUserError.stack);
        response.status(503).send('error executing query');
        return;
      }

      console.table(addUserResult.rows);

      response.send('successfully created account! Please return to main page to log in');
    });
  });
});

// end of functionality for user to sign up an account by filling up a form ------------
// --------------------------------------------------------------------------

// start of functionality for user to login by filling up a form ------------

// render the login form that will create the request
app.get('/login', (request, response) => {
  console.log('request to render a login form came in');

  response.render('login');
});

// accept the form request and validate the user email and password
app.post('/login', (request, response) => {
  console.log('post request to login came in');

  const values = [request.body.email];

  pool.query('SELECT * from users WHERE email=$1', values, (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send('unexpected error');
      return;
    }

    if (result.rows.length === 0) {
      // we didnt find a user with that email.
      // the error for password and user are the same.
      // don't tell the user which error they got for security reasons,
      // otherwise people can guess if a person is a user of a given service.
      response.status(403).send('sorry login failed! Please login again <a href="/login">here</a>');
      return;
    }

    // get the user object
    const user = result.rows[0];

    // verify the password
    if (user.password === request.body.password) {
      // entered password matches user password in users table

      // create new SHA object for user id
      const userIdShaObj = new jsSha('SHA-512', 'TEXT', { encoding: 'UTF8' });

      // create an unhashed cookie string based on user ID and salt
      const unhashedUserIdCookieString = `${user.id}-${myEnvVar}`;
      console.log('unhashed cookie string:', unhashedUserIdCookieString);
      // input the unhashed cookie string to the SHA object
      userIdShaObj.update(unhashedUserIdCookieString);
      // generate a hashed cookie string using SHA object
      const hashedUserIdCookieString = userIdShaObj.getHash('HEX');
      // set the loggedInHash and userId cookies in the response
      response.cookie('loggedInHash', hashedUserIdCookieString);
      response.cookie('userId', user.id);

      // send the response
      response.send('logged in! Click <a href="/">here</a> to return to return to the main page.');
    } else {
      // password didn't match
      // the error for password and user are the same
      // don't tell the user which error they got for security reasons,
      // otherwise people can guess if a person is a user of a given service.
      response.status(403).send('sorry login failed! Please login again <a href="/login">here</a>');
    }
  });
});

// end of functionality for user to login by filling up a form ------------
// --------------------------------------------------------------------------

// start of functionality for user to logout ------------

// accept the logout request
app.delete('/logout', (request, response) => {
  console.log('request to logout came in');

  response.clearCookie('userId');
  response.clearCookie('loggedInHash');

  response.send('you have logged out! Click <a href="/">here</a> to return to mainpage');
});

// end of functionality for user to logout ------------
// ----------------------------------------------------

// set the port to listen for requests
app.listen(PORT);
