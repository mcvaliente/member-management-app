require('dotenv').config();

const express = require('express');
const cors = require('cors');
const port = 4000;
const relay = require('../functions/relay').handler;
// Create Express app
const app = express();

app.use(express.json());
app.use(cors());

const relayHandler = (req, res) => {
  relay({ body: JSON.stringify(req.body) }, null, (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      const { body, statusCode } = response;
      res.status(statusCode).send(JSON.parse(body));
    }
  });
  //res.status(200).send(JSON.parse('{ "hash": "0x0000", "name":"John", "age":30, "city":"New York", "error" : ""}'))
  console.log("Sending request.");
};

//It captures the call http://localhost:4000/relay ('/relay' as the firs parameter)
//since the node server is listening in http://localhost:4000, and then it executes
//the function relayHandler.
app.post('/relay', relayHandler);

// Start the Express server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})

