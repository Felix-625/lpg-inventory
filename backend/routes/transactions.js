const express = require("express");
const Cylinder = require("../models/Cylinder");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const { type, month } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;

    const filter = {};
    if (type === "sale" || type === "delivery") filter.type = type;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, m] = month.split("-").map(Number);
      // Month is 0-indexed in JS Date
      const start = new Date(Date.UTC(year, m - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, m, 1, 0, 0, 0));
      filter.createdAt = { $gte: start, $lt: end };
    }

    let query = Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate("recordedBy", "name email");

    if (limit > 0) query = query.limit(limit);

    const txs = await query;
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delivery
router.post("/delivery", async (req, res) => {
  try {
    const { cylinderId, quantity, emptyReturned = 0, supplier, note } = req.body;
    if (!cylinderId || !quantity)
      return res.status(400).json({ message: "cylinderId & quantity required" });

    const cylinder = await Cylinder.findById(cylinderId);
    if (!cylinder) return res.status(404).json({ message: "Cylinder not found" });

    cylinder.fullCount += Number(quantity);
    cylinder.emptyCount = Math.max(0, cylinder.emptyCount - Number(emptyReturned));
    await cylinder.save();

    const tx = await Transaction.create({
      type: "delivery",
      cylinder: cylinder._id,
      brand: cylinder.brand,
      cylinderSize: cylinder.size,
      quantity,
      emptyReturned,
      supplier,
      note,
      recordedBy: req.user.id,
    });

    res.status(201).json({ transaction: tx, cylinder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sale
router.post("/sale", async (req, res) => {
  try {
    const { cylinderId, quantity, emptyReturned = 0, customer, note } = req.body;
    if (!cylinderId || !quantity)
      return res.status(400).json({ message: "cylinderId & quantity required" });

    const cylinder = await Cylinder.findById(cylinderId);
    if (!cylinder) return res.status(404).json({ message: "Cylinder not found" });

    if (cylinder.fullCount < quantity)
      return res.status(400).json({ message: "Not enough full cylinders in stock" });

    cylinder.fullCount -= Number(quantity);
    cylinder.emptyCount += Number(emptyReturned);
    await cylinder.save();

    const total = cylinder.price * Number(quantity);

    const tx = await Transaction.create({
      type: "sale",
      cylinder: cylinder._id,
      brand: cylinder.brand,
      cylinderSize: cylinder.size,
      quantity,
      emptyReturned,
      unitPrice: cylinder.price,
      totalAmount: total,
      customer,
      note,
      recordedBy: req.user.id,
    });

    res.status(201).json({ transaction: tx, cylinder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;