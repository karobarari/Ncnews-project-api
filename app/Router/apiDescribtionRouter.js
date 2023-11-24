const express = require("express");
const router = express.Router();
const { apiDescription } = require("../app.controllers");

router.get("/", apiDescription);

module.exports = router;
