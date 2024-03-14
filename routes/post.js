const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const { requireAuth } = require("../public/javascripts/utils/isAuth");

router.get("/", postController.post_get);

// GET request to add a post
router.get("/add", requireAuth, postController.post_add_get);

// POST request to add a post
router.post("/add", requireAuth, postController.post_add_post);

// GET request to delete a post
router.get("/delete/:id", requireAuth, postController.post_delete);

module.exports = router;