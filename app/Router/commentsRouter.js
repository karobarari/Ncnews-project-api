const express = require("express");
const router = express.Router();
const { deleteComment } = require("../app.controllers");

router.delete("/:comment_id", deleteComment);

module.exports = router;
