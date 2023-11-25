const express = require("express");
const router = express.Router();
const { deleteComment, patchComment } = require("../app.controllers");

router.delete("/:comment_id", deleteComment);
router.patch("/:comment_id", patchComment);


module.exports = router;
