exports.handleNotFoundError = (err, req, res, next)=>{
 if (err.status === 404) {
   res.status(404).send({ msg: 'not found!' });
 } else next(err);   
}
exports.handleInvalidParamError = (err, req, res, next)=>{
 if (err.code==='22P02') {
  console.log(err.code,'---------------------');
   res.status(400).send({ msg: "Invalid input" });
 } else next(err);   

}

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error!" });
};