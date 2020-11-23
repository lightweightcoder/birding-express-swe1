// get the node libraries
import { readFile, writeFile } from 'fs';

// add an object to an array of objects in a JSON file
export function add(filename, key, input, callback) {
  // set the file read callback
  const whenFileIsRead = (readingError, JsonContent) => {
    // check for reading errors
    if (readingError) {
      console.log('reading error', readingError);
      callback(null, readingError);
      return;
    }

    // parse the string into a JavaScript object
    const content = JSON.parse(JsonContent);

    // check for the key, if it doesn't exist, exit out
    if (key in content === false) {
      // create your own error message
      const errorMessage = "key doesn't exist";

      // call the callback
      callback(null, errorMessage);
      return;
    }

    content[key].push(input);

    // turn it into a string
    const outputContent = JSON.stringify(content);

    writeFile(filename, outputContent, (writingError) => {
      if (writingError) {
        console.log('error writing', outputContent, writingError);
        callback(null, writingError);
      } else {
        // file written successfully
        console.log('write file success!');
        callback(content, null);
      }
    });
  };

  // read the file
  readFile(filename, 'utf-8', whenFileIsRead);
}

// read a file. call the callback with the file contents
export function read(filename, callback) {
  const whenFileIsRead = (error, jsonContent) => {
    // check for reading errors
    if (error) {
      console.log('reading error', error);
      return;
    }

    // start dealing with the JSON

    // parse the string into a *real* JavaScript object
    const content = JSON.parse(jsonContent);

    // call the function that got passed in
    callback(content, null);
  };

  // read the file
  readFile(filename, 'utf-8', whenFileIsRead);
}

// write a file with the object passed in
export function write(filename, content, callback) {
  const outputContent = JSON.stringify(content);

  writeFile(filename, outputContent, (error) => {
    if (error) {
      console.log('error writing', outputContent, error);
      callback(null, error);
    } else {
      // file written successfully
      console.log('write file success!');
      callback(outputContent, null);
    }
  });
}
