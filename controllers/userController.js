const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const signUpTitle = "Sign Up";
const loginTitle = "Login to your account";

// User authentication
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            };

            // Compare hashed passwords
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
})


// Sign up get
exports.sign_up_get = asyncHandler(async (req, res, next) => {
    res.render("signUp", { 
        title: signUpTitle,
        firstName: "",
        lastName: "",
        username: "",
        errors: []
    });
});

// Sign up post
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
        .isLength({ min: 1, max: 20 })
        .withMessage("Username must be between 1 and 50 characters")
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
                throw new Error("Passwords don't match")
            }
            return true;
        })
        .escape(),

    async(req, res, next) => {
        try {
            // Validate results and render sign up page again if errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.render("signUp", {
                    title: signUpTitle,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    errors: errors.array(),
                });
                return;
            }

            // Check if a user with the same username is already registered
            const registeredUser = await User.findOne({ username: new RegExp('^' + req.body.username + '$', 'i') }).exec();
            if (registeredUser) {
                res.render("signUp", {
                    title: signUpTitle,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: null,
                    errors: [{msg: "Username already exists"}],
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
                res.redirect("/user/login");
            });

        } catch(err) {
            return next(err)
        }
    }
]

// Login get
exports.login_get = asyncHandler(async (req, res, next) => {
    res.render("login", {
        title: loginTitle,
        username: null,
        errors: [],
        authentication_error: req.flash("error")   // Access the authentication errors stored in the session
    });
});

// Login post
exports.login_post = [
    body("username")
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage("Username field must not be empty")
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Password field must not be empty")
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("login", {
                title: loginTitle,
                username: req.body.username,
                errors: errors.array(),
                authentication_error: null
            });
            return;
        }

        // Pass control to the authentication middleware
        next();
    }),

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        failureFlash: true    // Temporarily store error messages into the session
    }),
]

// Logout
exports.logout = asyncHandler(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/");
    });
});

// Become an admin
exports.become_admin_get = asyncHandler(async (req, res, next) => {
    res.render("becomeAdmin", {
        title: "Become an Admin"
    })
});

exports.become_admin_post = [
    body("becomeAdmin")
        .trim()
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect("/");
            return;
        }

        // Check whether their answer is correct
        const answer = req.body.becomeAdmin;
        if (answer != 80.90) {
            req.flash("adminMessage", "Incorrect answer. Try again.");
            res.redirect("/");
            return;
        }

        // Get the current user
        const user = await User.findById(req.user.id).exec();

        // Check if the user is already an admin
        if (user.isAdmin) {
            req.flash("adminMessage", "You are already an admin!");
            res.redirect("/");
            return;
        }

        user.isAdmin = true;
        user.save();

        req.flash("adminMessage", "Congratulations! You are now an admin.");
        res.redirect("/");
    })
]