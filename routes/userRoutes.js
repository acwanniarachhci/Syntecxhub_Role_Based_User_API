const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getMe } = require("../controllers/userController");

router.get("/me", protect, getMe);

module.exports = router;