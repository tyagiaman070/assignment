const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getMyDetails,
  updateMyProfile,
  getAUserWithEmail,
  getAllUsers,
  deleteAUser,
  deleteMe,
} = require("../controllers/userController");
const { isUserAuthenticated, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// * register a user
router.route("/register").post(registerUser);

//  * login a user
router.route("/login").post(loginUser);

// * forgot pass
router.route("/password/forgot").post(forgotPassword);

// * reset pass
router.route("/password/reset/:token").put(resetPassword);

// ? to logout --loggedIn
router.route("/logout/:id").get(logout);

// ? to get user profile --loggedIn
router.route("/me").get(isUserAuthenticated, getMyDetails);

// ? update my profile --loggedIn
router.route("/me/update").put(isUserAuthenticated, updateMyProfile);

// ? get Other Users Profile Data --loggedIn
router.route("/search-user/:email").get(isUserAuthenticated, getAUserWithEmail);

// ? delete me --loggedIn
router.route("/delete/me").delete(isUserAuthenticated, deleteMe);

// !  get all users --admin
router
  .route("/admin/users")
  .get(isUserAuthenticated, authorizeRoles("admin"), getAllUsers);

// !  Delete a user --admin
router
  .route("/admin/user/:id")
  .delete(isUserAuthenticated, authorizeRoles("admin"), deleteAUser);

module.exports = router;
