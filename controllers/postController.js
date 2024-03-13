const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.posts_get = asyncHandler(async (req, res, next) => {
    res.render("index", { title: "Posts" });
});


