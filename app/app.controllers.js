const {
  selectTopics,
  readEndpoints,
  selectArticle,
  selectArticlesById,
  selectComment,
  createComment,
  updateArticleVotes,
  removeComment
} = require("./app.models");

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

exports.getAllTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  selectArticle()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectComment(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const { body, params } = req;

  const passedComment = body;
  passedComment.article_id = params.article_id;
  createComment(passedComment)
    .then((postedCm) => {
      res.status(201).send({postedCm});
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { body, params } = req;

  const passedComment = body;
  passedComment.article_id = params.article_id;

  // Call the correct function
  updateArticleVotes(passedComment)
    .then((updatedArticle) => {
      res.status(200).send({updatedArticle});
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};