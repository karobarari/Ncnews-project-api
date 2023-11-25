const express = require("express");
const router = express.Router();
const {
  getArticleById,
  getArticle,
  getCommentsByArticle,
  postComment,
  patchArticle,
} = require("../app.controllers");


router.get("/", getArticle);
router.get("/:article_id", getArticleById);
router.get("/:article_id/comments", getCommentsByArticle);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", patchArticle);

module.exports = router;
