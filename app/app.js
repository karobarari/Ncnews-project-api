const express = require("express");
const articlesRouter = require("./Router/articlesRouter");
const topicRouter = require("./Router/topicRouter");
const commentsRouter = require("./Router/commentsRouter");
const usersRouter = require("./Router/usersRouter");
const apiDescriptionRouter = require("./Router/apiDescribtionRouter");

const {
  handleNotFoundError,
  handleServerErrors,
  handleInvalidParamError,
  handleNotARouteError,
} = require("./errors");

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

app.listen(9090);
module.exports = app;
