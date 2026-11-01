const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  promoteUser,
  demoteUser,
  getAuditLogs,
} = require("../controllers/adminController");

router.use(protect, restrictTo("admin"));

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);
router.patch("/users/:id/promote", promoteUser);
router.patch("/users/:id/demote", demoteUser);
router.get("/audit-logs", getAuditLogs);

module.exports = router;