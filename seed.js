require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL;
    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = "admin";
      existing.isBlocked = false;
      existing.password = process.env.ADMIN_PASSWORD; 
      await existing.save();
      console.log(`Existing user ${email} set to admin and password reset`);
    } else {
      await User.create({
        username: process.env.ADMIN_USERNAME,
        email,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`Admin created: ${email}`);
    }
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
  }
})();