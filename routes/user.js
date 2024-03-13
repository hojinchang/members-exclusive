const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// GET request for creating a user
router.get("/sign-up", userController.sign_up_get);

// Post request for creating a user
router.post("/sign-up", userController.sign_up_post);

// GET request for logging in
router.get("/login", userController.login_get);

// POST request for logging in
router.post("/login", userController.login_post);

// GET request for logging out
router.get("/logout", userController.logout);


module.exports = router;