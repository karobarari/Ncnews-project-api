exports.handleNotARouteError = (req, res, next) => {
  const error = new Error("Route not valid");
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
  if (
    err.code === "22P02" ||
    err.code === "42703" ||
    err.code === "23502" ||
    err.code === "42601"
  ) {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};
