const express = require("express");
const router = express.Router();
const { getAllTopics } = require("../app.controllers");

router.get("/", getAllTopics);

module.exports = router;
