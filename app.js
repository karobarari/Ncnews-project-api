const express = require("express");
const articlesRouter = require("./app/Router/articlesRouter");
const topicRouter = require("./app/Router/topicRouter");
const commentsRouter = require("./app/Router/commentsRouter");
const usersRouter = require("./app/Router/usersRouter");
const apiDescriptionRouter = require("./app/Router/apiDescribtionRouter");

const {
  handleNotFoundError,
  handleServerErrors,
  handleInvalidParamError,
  handleNotARouteError,
} = require("./app/errors");

const app = express();
app.use(express.json());

app.use("/api/articles", articlesRouter);
app.use("/api/topics", topicRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);
app.use("/api", apiDescriptionRouter);



app.use(handleNotARouteError);
app.use(handleNotFoundError);
app.use(handleInvalidParamError);
app.use(handleServerErrors); //last in the order

module.exports = app;
