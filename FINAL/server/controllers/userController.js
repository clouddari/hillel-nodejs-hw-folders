const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sanitizeHtml = require("sanitize-html");

const cleanInput = sanitizeHtml(req.body.comment, {
  allowedTags: [],
  allowedAttributes: {},
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const sanitizedUsername = sanitizeHtml(req.body.username, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const sanitizedEmail = sanitizeHtml(req.body.email, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const sanitizedProfilePic = req.body.profilePic
      ? sanitizeHtml(req.body.profilePic, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : "";

    const updates = {
      username: sanitizedUsername,
      email: sanitizedEmail,
    };

    const existingUsername = await User.findOne({
      username: sanitizedUsername,
      _id: { $ne: req.user.id },
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists. Please choose another one.",
      });
    }

    const existingEmail = await User.findOne({
      email: sanitizedEmail,
      _id: { $ne: req.user.id },
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists. Please choose another one." });
    }

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password.trim(), 10);
    }

    if (req.file) {
      updates.profilePic = "/uploads/" + req.file.filename;
    } else if (sanitizedProfilePic) {
      updates.profilePic = sanitizedProfilePic;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
