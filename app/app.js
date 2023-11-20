const express = require("express");
const { getAllTopics } = require('./app.controllers')
const { handleNotFoundError, handleServerErrors } = require('./errors')

const app = express();




app.get('/api/:topics', getAllTopics);


app.use(handleNotFoundError);
app.use(handleServerErrors)


app.listen(9090)
module.exports = app;
