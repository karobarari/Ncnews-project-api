exports.handleNotFoundError = (err, req, res, next)=>{
 if (err.code === "42P01") {
   res.status(404).send({ msg: err.msg });
 } else next(err);   
}

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};