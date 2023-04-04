const express = require("express");
const { createUser,getAllUsers } = require("../Controllers/user");
const { createDoctor,getAllDoctors,getDoctors,updateDoctor,deleteDoctor,doctorDetails } = require("../Controllers/doctor");
const router = express.Router();

router.route("/register").post(createUser);
router.route("/users").get(getAllUsers);
router.route("/doctor").post(createDoctor);
router.route("/doctors").get(getAllDoctors);
router.route("/admin/doctors").get(getDoctors);
router.route("/doctor/:id").put(updateDoctor);
router.route("/doctor/:id").delete(deleteDoctor);
router.route("/doctor/:id").get(doctorDetails);

module.exports = router;