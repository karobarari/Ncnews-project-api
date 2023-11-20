exports.handleNotFoundError = (err, req, res, next) => {
  if (err.code === "42P01") {
    res.status(404).send({ msg: err.msg });
  } else next(err);
};
