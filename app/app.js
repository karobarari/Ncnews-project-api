const express = require("express");
const {
  getAllTopics,
  apiDescription,
  getArticle,
} = require("./app.controllers");
const { handleNotFoundError, handleServerErrors } = require("./errors");

const app = express();

app.get("/api", apiDescription);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/articles", getArticle);


app.use(handleNotFoundError);
app.use(handleServerErrors); //last in the order

app.listen(9090);
module.exports = app;
