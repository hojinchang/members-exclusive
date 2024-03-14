const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const { requireAuth } = require("../public/javascripts/utils/isAuth");

router.get("/", postController.post_get);

// GET request to add a post
router.get("/add", requireAuth, postController.post_add_get);

router.post("/add", requireAuth, postController.post_add_post);

module.exports = router;