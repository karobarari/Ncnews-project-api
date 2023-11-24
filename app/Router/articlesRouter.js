const express = require("express");
const router = express.Router();
const {
  getArticleById,
  getArticle,
  getCommentsByArticle,
  postComment,
  patchComment,
} = require("../app.controllers");


router.get("/", getArticle);
router.get("/:article_id", getArticleById);
router.get("/:article_id/comments", getCommentsByArticle);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", patchComment);

module.exports = router;
