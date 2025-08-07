const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sanitizeHtml = require("sanitize-html");

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
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const sanitizedUsername = sanitizeHtml(req.body.username || "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const sanitizedEmail = sanitizeHtml(req.body.email || "", {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    const sanitizedProfilePic = req.body.profilePic
      ? sanitizeHtml(req.body.profilePic, {
          allowedTags: [],
          allowedAttributes: {},
        }).trim()
      : "";

    const updates = {};

    if (
      sanitizedUsername &&
      sanitizedUsername !== currentUser.username
    ) {
      const existingUsername = await User.findOne({
        username: sanitizedUsername,
        _id: { $ne: req.user._id },
      });

      if (existingUsername) {
        return res
          .status(400)
          .json({ message: "Username already exists. Please choose another one." });
      }

      updates.username = sanitizedUsername;
    }

    if (
      sanitizedEmail &&
      sanitizedEmail !== currentUser.email
    ) {
      const existingEmail = await User.findOne({
        email: sanitizedEmail,
        _id: { $ne: req.user.id },
      });

      if (existingEmail) {
        return res
          .status(400)
          .json({ message: "Email already exists. Please choose another one." });
      }

      updates.email = sanitizedEmail;
    }

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password.trim(), 10);
    }

    if (req.file) {
      updates.profilePic = "/uploads/" + req.file.filename;
    } else if (sanitizedProfilePic) {
      updates.profilePic = sanitizedProfilePic;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

