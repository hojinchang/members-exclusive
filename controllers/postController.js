const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.post_get = asyncHandler(async (req, res, next) => {
    const posts = await Post.find()
                            .populate("user")
                            .sort({ postTime: -1 })
                            .exec();

    res.render("index", { 
        title: "Posts",
        posts: posts
    });
});

exports.post_add_get = asyncHandler(async (req, res, next) => {
    res.render("postAdd", {
        title: "Add Post"
    })
});

exports.post_add_post = [
    body("title")
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage("Title field must not be empty")
        .escape(),
    body("message")
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage("Message must be between 1 and 200 characters")
        .escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            res.render("postAdd", {
                title: "Add Post",
                errors: errors.array()
            });
            return;
        }

        const post = new Post({
            title: req.body.postTitle,
            message: req.body.message,
            user: res.locals.currentUser
        });

        await post.save();
        res.redirect("/");
    })
]
