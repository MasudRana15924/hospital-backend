const express = require("express");
const { createUser,getAllUsers } = require("../Controllers/user");

const router = express.Router();
router.route("/register").post(createUser);
router.route("/users").get(getAllUsers);

module.exports = router;