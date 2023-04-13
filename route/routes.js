const express = require("express");
const { createUser, getAllUsers, loginUser, logout, forgotPassword, getUserDetails, updatePassword, updateProfile,getSingleUser, updateUserRole, deleteUser } = require("../Controllers/user");
const { createDoctor, getAllDoctors, getDoctors, updateDoctor, deleteDoctor, doctorDetails, createDoctorReview,getDoctorReviews, deleteReview } = require("../Controllers/doctor");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// users routes
router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/logout").get(logout);
router.route("/currentUserDetails").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
router.route("/update/currentUserdetails").put(isAuthenticatedUser, updateProfile);
router.route("/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
.put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


// doctors routes
router.route("/doctor").post(isAuthenticatedUser, authorizeRoles("admin"), createDoctor);
router.route("/doctors").get(getAllDoctors);
router.route("/admin/doctors").get(isAuthenticatedUser, authorizeRoles("admin"), getDoctors);
router.route("/doctor/:id").put(updateDoctor);
router.route("/doctor/:id").delete(deleteDoctor);
router.route("/doctor/:id").get(doctorDetails);
router.route("/create/review").put(isAuthenticatedUser, createDoctorReview);
router.route("/doctors/reviews").get(isAuthenticatedUser, getDoctorReviews);
router.route("/doctors/reviews").delete(isAuthenticatedUser, deleteReview);

// appointment routes 


module.exports = router;