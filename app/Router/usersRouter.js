const express = require("express");
const router = express.Router();
const { getUsers } = require("../app.controllers");

router.get("/", getUsers);

module.exports = router;
