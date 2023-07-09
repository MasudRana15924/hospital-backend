const express = require("express");
const { createUser, getAllUsers, loginUser, logout, forgotPassword, getUserDetails, updatePassword, updateProfile,getSingleUser, updateUserRole, deleteUser, verifyEmail, resetPassword, updateAvatar } = require("../Controllers/user");
const { createDoctor, getAllDoctors, getDoctors, updateDoctor, deleteDoctor, doctorDetails, createDoctorReview,getDoctorReviews, deleteReview, loginDoctor, logoutDoctor, getDoctorDetails, doctorforgotPassword, doctorResetPassword, doctorUpdatePassword, doctorUpdateUrl } = require("../Controllers/doctor");
const { isAuthenticatedUser, authorizeRoles, isAuthenticatedDoctor } = require("../middlewares/auth");
const { newAppointment, getSingleAppointment, myAppointment, getAllAppointments, updateBooking, deleteAppointment, doctorAppointment, updatePrescription, paymentSuccessful, newOnsiteAppointment, appointmentUrl } = require("../Controllers/appointment");
const { createNurse, getAllNurses, getNurses, nurseDetails, createNursesReview, getNurseReviews, updateNurse } = require("../Controllers/nurse");
const { newHireNurse, getSingleHireNurse, myHireNurse, getAllHireNurse, updateHireNurse, deleteHireNurse } = require("../Controllers/hireNurse");
const { createCategory, getAllCategory } = require("../Controllers/Category");
const { createFees, getAllFees } = require("../Controllers/priceCat");
const { createGender, getAllGender } = require("../Controllers/gender");
const { createRatings, getAllRatings } = require("../Controllers/ratings");
const { newBloodBooking } = require("../Controllers/bloods");
const { createActive, getActive } = require("../Controllers/active");
const { createMedicine, getAllMedicines } = require("../Controllers/medicine");
const { newOrder, orderPaymentSuccessful, myOrders, getAllOrders } = require("../Controllers/order");
const { createPrescription, myPrescription } = require("../Controllers/prescription");


const router = express.Router();

// users routes
router.route("/register").post(createUser);
router.route("/activation").post(verifyEmail);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logout);
router.route("/currentUserDetails").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
router.route("/update/currentUserdetails").put(isAuthenticatedUser, updateProfile);
router.route("/update/avatar").put(isAuthenticatedUser, updateAvatar);
router.route("/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
.put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
.delete( deleteUser);

// doctor as a user 
router.route("/register/doctor").post(createDoctor);
router.route("/login/doctor").post(loginDoctor);
router.route("/logout/doctor").put(isAuthenticatedDoctor,logoutDoctor);
router.route("/current/Doctor/Details").get(isAuthenticatedDoctor, getDoctorDetails);
router.route("/doctor/forgotPassword").post( doctorforgotPassword);
router.route("/forgot/password/reset/:token").put(doctorResetPassword);
router.route("/doctor/updatePassword").put(isAuthenticatedDoctor, doctorUpdatePassword);
router.route("/doctor/update/url").put(isAuthenticatedDoctor,  doctorUpdateUrl);
router.route("/doctors").get(getAllDoctors);
router.route("/admin/doctors").get(isAuthenticatedUser, authorizeRoles("admin"), getDoctors);
router.route("/doctor/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateDoctor);
router.route("/doctor/:id").deleteisAuthenticatedUser, authorizeRoles("admin"),(deleteDoctor);
router.route("/doctor/:id").get(doctorDetails);
router.route("/create/review").put( isAuthenticatedUser,createDoctorReview);
router.route("/doctors/reviews").get(isAuthenticatedUser, getDoctorReviews);
router.route("/doctors/reviews").delete(isAuthenticatedUser, deleteReview);

// appointment routes 
router.route("/new/appointment").post(isAuthenticatedUser, newAppointment);
router.route("/new/onsiteappointment").post(isAuthenticatedUser, newOnsiteAppointment);
router.route("/success/:tranId").post(paymentSuccessful);
router.route("/appointment/:id").get(isAuthenticatedUser, getSingleAppointment);
router.route("/single/doctor/appointment").get(isAuthenticatedDoctor,doctorAppointment);
 router.route("/mybooking").get(isAuthenticatedUser, myAppointment);
router.route("/doctor/appointment/:id").put(isAuthenticatedDoctor,  updatePrescription)
router.route("/getall/appointment").get(isAuthenticatedUser, authorizeRoles("admin"), getAllAppointments);
router.route("/admin/appointment/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateBooking)
router.route("/admin/appointment/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAppointment);

// nurses routes
router.route("/create/nurse").post(isAuthenticatedUser, authorizeRoles("admin"), createNurse);
router.route("/get/nurses").get(getAllNurses);
router.route("/admin/nurses").get(isAuthenticatedUser, authorizeRoles("admin"), getNurses);
router.route("/nurse/:id").get(nurseDetails);
router.route("/create/nurse/review").put( isAuthenticatedUser,createNursesReview);
router.route("/nurses/reviews").get(isAuthenticatedUser, getNurseReviews);

// hire nurse
router.route("/new/hire/nurse").post(isAuthenticatedUser, newHireNurse);
router.route("/hire/nurse/:id").get(isAuthenticatedUser, getSingleHireNurse);
router.route("/my/hire").get(isAuthenticatedUser, myHireNurse);
router.route("/getall/hire/nurse").get(isAuthenticatedUser, authorizeRoles("admin"), getAllHireNurse);
router.route("/admin/hire/nurse/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateHireNurse)
router.route("/admin/hire/nurse/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteHireNurse);
router.route("/nurse/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateNurse);


// create category
router.route("/create/category").post( createCategory);
router.route("/category").get(getAllCategory);
router.route("/create/fees").post( createFees);
router.route("/fees").get(getAllFees);
router.route("/create/gender").post( createGender);
router.route("/gender").get(getAllGender);
router.route("/create/rating").post( createRatings);
router.route("/ratings").get(getAllRatings);
router.route("/create/status").post( createActive);
router.route("/status").get(getActive);
// blood
router.route("/blood/booking").post( newBloodBooking);


// medicine
router.route("/create/medicine").post( createMedicine);
router.route("/get/medicine").get( getAllMedicines);
router.route("/create/order").post(isAuthenticatedUser, newOrder);
router.route("/order/payment/success/:tranId").post(orderPaymentSuccessful);
router.route("/orders/myorders").get(isAuthenticatedUser, myOrders);
router.route("/admin/allorder").get(isAuthenticatedUser,authorizeRoles("admin"), getAllOrders);

// create prescription
router.route('/create/prescription').post(createPrescription);
router.route('/my/prescription').get(isAuthenticatedUser,myPrescription)

module.exports = router;