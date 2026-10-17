const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, trim: true },   // e.g., "Petron Gasul Elite"
    size: { type: String, required: true, trim: true },    // e.g., "11kg", "50kg"
    fullCount: { type: Number, default: 0, min: 0 },
    emptyCount: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// Unique per brand+size combination
cylinderSchema.index({ brand: 1, size: 1 }, { unique: true });

// Virtual display label
cylinderSchema.virtual("label").get(function () {
  return `${this.brand} ${this.size}`;
});

cylinderSchema.set("toJSON", { virtuals: true });
cylinderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Cylinder", cylinderSchema);