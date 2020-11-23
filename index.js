import express from 'express';
import methodOverride from 'method-override';
import pg from 'pg';

// Initialise the DB connection -----------------------------
const { Pool } = pg;
const pgConnectionConfigs = {
  user: 'aljt',
  host: 'localhost',
  database: 'birding',
  port: 5432, // Postgres server always runs on this port by default
};
const pool = new Pool(pgConnectionConfigs);

// Initialise Express -------------------------
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

// routes =============================================================

// start of functionality for user to create a new note by filling up a form ------------

// render the form (note.ejs) that will create the request
app.get('/note', (request, response) => {
  console.log('request to render a new note came in');

  response.render('note');
});

// accept form request and add the new note to
// 1st param: the url that the post request is coming from
// 2nd param: callback to execute when post request is made
app.post('/note', (request, response) => {
  console.log('post request of a new note came in');

  // create vars for the date, behaviour and flock_size
  const { date, behaviour, flockSize } = request.body;

  // set the values to put into the sql query
  const values = [date, behaviour, flockSize];

  // set the sql query
  const sqlQuery = 'INSERT INTO notes (date, behaviour, flock_size) VALUES ($1, $2, $3) RETURNING *';

  // callback function for sql query
  const whenDoneWithQuery = (error, result) => {
    if (error) {
      console.log('Error executing query', error.stack);
      response.status(503).send(`error 503: service unavilable.<br /> ${result.rows}`);
      return;
    }

    // redirect to newly created note
    response.redirect(`/note/${result.rows[0].id}`);
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
  const notesQuery = 'SELECT * FROM notes';

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

// set the port to listen for requests
app.listen(PORT);
