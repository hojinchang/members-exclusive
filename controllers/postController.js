const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.post_get = asyncHandler(async (req, res, next) => {
    res.render("index", { title: "Posts" });
});

exports.post_add_get = asyncHandler(async (req, res, next) => {
    res.render("postAdd", {
        title: "Add Post",
        postTitle: null
    })
});


