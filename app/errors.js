exports.handleNotARouteError = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};
exports.handleNotFoundError = (err, req, res, next) => {
  const { status, msg } = err;

  if (err.code === "23503" || status) {
    res.status(status || 404).send({ error: msg || "not found!" });
  } else {
    next(err);
  }
};

exports.handleInvalidParamError = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};
exports.handleNotARouteError = (req, res, next) => {
  return (error = new Error("Not a route").then(() => {
    error.status = 404;
  }));
};
