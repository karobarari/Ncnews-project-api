const express = require("express");
const {
  getAllTopics,
  apiDescription,
  getArticle,
  getArticleById,
  getCommentsByArticle,
  postComment,
  patchComment,
} = require("./app.controllers");
const {
  handleNotFoundError,
  handleServerErrors,
  handleInvalidParamError,
} = require("./errors");

const app = express();
app.use(express.json());

app.get("/api", apiDescription);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchComment);

app.use(handleNotFoundError);
app.use(handleInvalidParamError);
app.use(handleServerErrors); //last in the order

app.listen(9090);
module.exports = app;
