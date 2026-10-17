const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["delivery", "sale"], required: true },
    cylinder: { type: mongoose.Schema.Types.ObjectId, ref: "Cylinder", required: true },
    brand: { type: String, required: true },
    cylinderSize: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    emptyReturned: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    supplier: { type: String },
    customer: { type: String },
    note: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);