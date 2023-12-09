const {
  selectTopics,
  readEndpoints,
  selectArticle,
  selectArticlesById,
  selectComment,
  createComment,
  updateArticleVotes,
  removeComment,
  selectUsers,
  selectUserByUsername,
  updateCommentsVotes,
  createArticle,
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
  const { topic, sort_by, order, limit, p } = req.query;
  selectArticle(topic, sort_by, order, p, limit)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  const { page, limit } = req.query;
  const { article_id } = req.params;
  selectComment(article_id, page, limit)
    .then((comment) => {
      res.status(200).send({ comment });
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
      res.status(201).send({ postedCm });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { body, params } = req;

  const passedArticle = body;
  passedArticle.article_id = params.article_id;
  updateArticleVotes(passedArticle)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
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

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const { body, params } = req;

  const passedComment = body;
  passedComment.comment_id = params.comment_id;
  updateCommentsVotes(passedComment)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postArticle = (req, res, next) => {
  const { body } = req;
  createArticle(body)
    .then((postedArticle) => {
      res.status(201).send({postedArticle});
    })
    .catch((err) => {
      next(err);
    });
};
