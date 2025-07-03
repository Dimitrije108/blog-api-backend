const { Router } = require("express");
const router = Router();
const controller = require("../../controllers/dashboard");

// Dashboard
// Get collection of data needed for dashboard display
router.get("/", controller.getDashboard);

module.exports = router;
