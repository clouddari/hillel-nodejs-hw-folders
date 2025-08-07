const express = require("express");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/userController");
const { authenticate, requireRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/profile", authenticate, userController.getProfile);

router.put(
  "/profile",
  authenticate,
  upload.single("profilePic"),
  userController.updateProfile
);

router.post("/favorites/:itemId", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const itemId = req.params.itemId;

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.findIndex((fav) => fav.toString() === itemId);

    if (index === -1) {
      user.favorites.push(itemId);
    } else {
      user.favorites.splice(index, 1);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    console.error("Toggle favorite error:", err.message);
    res.status(500).json({ message: "Failed to update favorites" });
  }
});

router.get("/favorites", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites); 
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});


module.exports = router;
