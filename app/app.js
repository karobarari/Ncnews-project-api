const express = require("express");
const { getAllTopics } = require('./app.controllers')
const { handleNotFoundError } = require('./errors')

const app = express();
app.use(express.json());




app.get("/api/topics", getAllTopics);


app.use(handleNotFoundError);



app.listen(9090)
module.exports = app;
