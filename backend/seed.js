require("dotenv").config();
const mongoose = require("mongoose");
const Cylinder = require("./models/Cylinder");

const seedData = [
  // 11kg
  { brand: "Petron Gasul Elite", size: "11kg", fullCount: 30, emptyCount: 12, lowStockThreshold: 10, price: 950 },
  { brand: "Solane",             size: "11kg", fullCount: 25, emptyCount: 10, lowStockThreshold: 10, price: 920 },
  { brand: "Fiesta Gas",         size: "11kg", fullCount: 18, emptyCount: 8,  lowStockThreshold: 10, price: 880 },
  { brand: "TownGaz",            size: "11kg", fullCount: 6,  emptyCount: 3,  lowStockThreshold: 10, price: 850 },

  // 50kg
  { brand: "Petron Gasul Elite", size: "50kg", fullCount: 8,  emptyCount: 4,  lowStockThreshold: 5,  price: 4300 },
  { brand: "Solane",             size: "50kg", fullCount: 5,  emptyCount: 2,  lowStockThreshold: 5,  price: 4200 },
  { brand: "Fiesta Gas",         size: "50kg", fullCount: 3,  emptyCount: 1,  lowStockThreshold: 5,  price: 4100 },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Cylinder.deleteMany();
    await Cylinder.insertMany(seedData);
    console.log(`Seeded ${seedData.length} cylinder entries.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();