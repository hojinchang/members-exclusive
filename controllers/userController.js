const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render("signupForm", { title: "Sign Up" });
});

exports.sign_up_post = [
    body("firstName")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("First Name must be between 1 and 20 characters")
        .escape(),
    body("lastName")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("Last Name must be between 1 and 20 characters")
        .escape(),
    body("username")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Last Name must be between 1 and 50 characters")
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Password must be greater than 1 character")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .withMessage("Password must be at least 8 characters long and contains at least one lowercase letter, one uppercase letter, and one digit")
        .escape(),
    body("passwordConfirm")
        .trim()
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords don;t match")
            }
            return true;
        })
        .escape(),

    async(req, res, next) => {
        try {
            // Validate results and render sign up page again if errors
            const errors = validationResults(req);
            if (!errors.isEmpty()) {
                res.render("signupForm", {
                    title: "Sign Up",
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    errors: errors.array(),
                });
                return;
            }

            // Check if a user with the same username is already registered
            const registeredUser = await User.findOne({ username: req.body.username }).exec();
            if (registeredUser) {
                res.render("signupForm", {
                    title: "Sign Up",
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    errors: ["Username already exists"]
                })
            }

            // Hashing password using bcryptjs
            bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
                if (err) {
                    return next(err);
                }

                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    password: hashedPassword,
                });

                await user.save();
                res.redirect("/user/log-in");
            });

        } catch(err) {
            return next(err)
        }
    }
    

]