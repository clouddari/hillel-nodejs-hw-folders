const express = require("express");
const Item = require("../models/Item");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  const newItem = await Item.create(req.body);
  res.status(201).json(newItem);
});

router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

router.delete("/:id", authenticate, requireRole("admin"), async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

router.post("/:id/reviews", authenticate, async (req, res) => {
  const { rating, text } = req.body;

  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  const newReview = {
    author: req.user.username,
    authorPic: req.user.profilePic,
    rating,
    text,
    approved: false,
  };

  item.reviews.push(newReview);

  await item.save();

  res.status(201).json({ message: "Review submitted for approval" });
});

router.put(
  "/reviews/:reviewId/approve",
  authenticate,
  requireRole("admin"),
  async (req, res) => {
    const { reviewId } = req.params;
    const item = await Item.findOne({ "reviews._id": reviewId });

    if (!item)
      return res
        .status(404)
        .json({ message: "Item with such review not found" });

    const review = item.reviews.id(reviewId);

    if (!review) return res.status(404).json({ message: "Review not found" });

    review.approved = true;
    await item.save();

    res.json({ message: "Review approved", review });
  }
);

router.get(
  "/reviews/pending",
  authenticate,
  requireRole("admin"),
  async (req, res) => {
    const items = await Item.find({ "reviews.approved": false });

    const pendingReviews = [];

    for (const item of items) {
      const reviews = item.reviews
        .filter((r) => !r.approved)
        .map((r) => ({
          itemId: item._id,
          itemName: item.name,
          itemType: item.type,
          ...r.toObject(),
        }));
      pendingReviews.push(...reviews);
    }

    res.json(pendingReviews);
  }
);

router.get("/reviews/latest", async (req, res) => {
  try {
    const items = await Item.find({ "reviews.approved": true });

    const allApproved = [];

    for (const item of items) {
      const approvedReviews = item.reviews
        .filter((r) => r.approved)
        .map((r) => ({
          ...r.toObject(),
          itemName: item.name,
          itemId: item._id,
        }));

      allApproved.push(...approvedReviews);
    }

    allApproved.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(allApproved.slice(0, 5));
  } catch (err) {
    console.error("Latest reviews error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete(
  "/reviews/:reviewId",
  authenticate,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { reviewId } = req.params;

      const item = await Item.findOne({ "reviews._id": reviewId });

      if (!item) {
        return res
          .status(404)
          .json({ message: "Item with such review not found" });
      }

      item.reviews = item.reviews.filter((r) => r._id.toString() !== reviewId);
      await item.save();

      res.json({ message: "Review deleted" });
    } catch (err) {
      console.error("Error deleting review:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/:id", authenticate, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
