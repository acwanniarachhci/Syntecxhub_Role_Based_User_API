const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    action: {
      type: String,
      enum: ["BLOCK_USER", "UNBLOCK_USER", "PROMOTE_USER", "DEMOTE_USER"],
      required: true,
    },
   
    target: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    details: { type: String },
  },
  { timestamps: true } // createdAt
);

module.exports = mongoose.model("AuditLog", auditLogSchema);