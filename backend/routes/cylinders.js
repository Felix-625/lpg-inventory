const express = require("express");
const Cylinder = require("../models/Cylinder");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

// Get all cylinders (grouped later on the client)
router.get("/", async (_req, res) => {
  const cylinders = await Cylinder.find().sort({ brand: 1, size: 1 });
  res.json(cylinders);
});

// Create a cylinder type
router.post("/", async (req, res) => {
  try {
    const { brand, size, fullCount, emptyCount, lowStockThreshold, price } = req.body;
    if (!brand || !size)
      return res.status(400).json({ message: "Brand and size are required" });

    const existing = await Cylinder.findOne({ brand, size });
    if (existing)
      return res.status(400).json({
        message: `${brand} ${size} already exists`,
      });

    const cylinder = await Cylinder.create({
      brand,
      size,
      fullCount: fullCount ?? 0,
      emptyCount: emptyCount ?? 0,
      lowStockThreshold: lowStockThreshold ?? 10,
      price,
    });
    res.status(201).json(cylinder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const cylinder = await Cylinder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cylinder) return res.status(404).json({ message: "Not found" });
    res.json(cylinder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  await Cylinder.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;