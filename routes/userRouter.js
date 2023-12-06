const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const User = require("../models/User");
const roleMiddleware = require("../middleware/roleMiddleware")

const router = express.Router();

router.route("/singup").post(
  [
    body("name").not().isEmpty().withMessage("Please Enter Your Name"),
    body("email")
      .isEmail()
      .withMessage("Please Enter Valid Email")
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          return Promise.reject("Email is already exist");
        });
      }),
    body("password").not().isEmpty().withMessage("Please Enter Your Password"),
  ],
  authController.createUser
);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboardPage);
router.route("/:id").delete(authController.deleteUser)
router.route("/edit/:id").put(roleMiddleware(["admin"]), authController.editUserRole)

module.exports = router;
