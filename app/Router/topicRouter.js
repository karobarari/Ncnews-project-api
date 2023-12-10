const express = require("express");
const router = express.Router();
const { getAllTopics, postTopic } = require("../app.controllers");

router.get("/", getAllTopics);
router.post("/", postTopic)

module.exports = router;
