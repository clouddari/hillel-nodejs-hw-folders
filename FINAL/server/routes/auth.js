const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/dev.json");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { username, fullname, email, password, profilePic } = req.body;

    if (!username || !email || !password || !fullname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imagePath = "/uploads/default-user.png";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (profilePic) {
      imagePath = profilePic;
    }

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
      profilePic: imagePath,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
});

module.exports = router;
