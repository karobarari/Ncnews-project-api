const express = require("express");
const {
  getAllTopics,
  apiDescription,
  getArticleById,
} = require("./app.controllers");
const {
  handleNotFoundError,
  handleServerErrors,
  handleInvalidParamError,
} = require("./errors");

const app = express();

app.get("/api", apiDescription);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);


app.use(handleNotFoundError);
app.use(handleInvalidParamError);
app.use(handleServerErrors);//last in the order

app.listen(9090);
module.exports = app;
