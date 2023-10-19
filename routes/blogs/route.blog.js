const { handleGetBlog, handleGetBlogById } = require("../../controllers/blog/controller.blog");

const router = require("express").Router();


router.get("/",handleGetBlog);
router.get("/:id",handleGetBlogById);

module.exports = router;