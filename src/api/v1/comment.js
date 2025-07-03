const { Router } = require("express");
const router = Router();
const controller = require("../../controllers/comment");

// Comments
// Get all comments
router.get("/", controller.getAllComments);
// Delete comment
router.delete("/:commentId", controller.deleteComment);

module.exports = router;