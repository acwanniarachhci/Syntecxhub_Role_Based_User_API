const mongoose = require("mongoose");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const logAction = (actorId, action, targetId, details) =>
  AuditLog.create({ actor: actorId, action, target: targetId, details });

// GET /api/admin/users?role=admin&blocked=true
exports.getAllUsers = async (req, res) => {
  try {
    const { role, blocked } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (blocked !== undefined) filter.isBlocked = blocked === "true";

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Block / unblock / promote / demote helper
const changeUser = ({ action, message, selfBlock, apply, check }) => {
  return async (req, res) => {
    try {
      const { id } = req.params;
      if (!isValidId(id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }

      if (selfBlock && String(req.user._id) === id) {
        return res.status(400).json({
          success: false,
          message: "You cannot perform this action on your own account",
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const problem = check(user);
      if (problem) {
        return res.status(400).json({ success: false, message: problem });
      }

      apply(user);
      await user.save();
      await logAction(req.user._id, action, user._id, message(user));

      res.status(200).json({ success: true, message: message(user), data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
};

exports.blockUser = changeUser({
  action: "BLOCK_USER",
  selfBlock: true,
  check: (u) => (u.isBlocked ? "User is already blocked" : null),
  apply: (u) => (u.isBlocked = true),
  message: (u) => `User ${u.username} blocked`,
});

exports.unblockUser = changeUser({
  action: "UNBLOCK_USER",
  selfBlock: false,
  check: (u) => (!u.isBlocked ? "User is not blocked" : null),
  apply: (u) => (u.isBlocked = false),
  message: (u) => `User ${u.username} unblocked`,
});

exports.promoteUser = changeUser({
  action: "PROMOTE_USER",
  selfBlock: false,
  check: (u) => (u.role === "admin" ? "User is already an admin" : null),
  apply: (u) => (u.role = "admin"),
  message: (u) => `User ${u.username} promoted to admin`,
});

exports.demoteUser = changeUser({
  action: "DEMOTE_USER",
  selfBlock: true,
  check: (u) => (u.role === "user" ? "User is already a regular user" : null),
  apply: (u) => (u.role = "user"),
  message: (u) => `User ${u.username} demoted to user`,
});

// GET /api/admin/audit-logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("actor", "username email")
      .populate("target", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};