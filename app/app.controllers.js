const { selectTopics } = require('./app.models')


exports.getAllTopics = ( req,res,next)=>{
   const  {topics}  = req.params
     selectTopics(`${topics}`).then((topics)=>{
        res.status(200).send(topics);
    }).catch(next)
}