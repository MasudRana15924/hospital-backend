const express = require("express");
const { createUser,getAllUsers } = require("../Controllers/user");
const { createDoctor,getAllDoctors } = require("../Controllers/doctor");

const router = express.Router();
router.route("/register").post(createUser);
router.route("/users").get(getAllUsers);
router.route("/doctor").post(createDoctor);
router.route("/doctors").get(getAllDoctors);

module.exports = router;