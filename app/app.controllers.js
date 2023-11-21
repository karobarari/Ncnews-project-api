const { selectTopics, readEndpoints } = require("./app.models");

exports.apiDescription = (req, res, next) => {
  readEndpoints((err, endpointData) => {
    if (err) {
      console.error("Error fetching API descriptions:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).json(endpointData);
  });
};

    

exports.getAllTopics = ( req,res,next)=>{
     selectTopics().then((topics)=>{
        res.status(200).send({topics});
    }).catch(next)
}