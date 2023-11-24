const express = require("express");
const router = express.Router();
const { getUsers, getUserByUsername } = require("../app.controllers");

router.get("/", getUsers);
router.get("/:username", getUserByUsername);

module.exports = router;
