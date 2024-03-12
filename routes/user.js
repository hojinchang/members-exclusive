const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// GET request for creating a user
router.get("/sign-up", userController.sign_up_get);

// Post request for creating a user
router.post("/sign-up", userController.sign_up_post);