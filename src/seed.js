require("dotenv").config();
const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_URL;

mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  purchase_price: { type: Number, required: true },
});
const Product = mongoose.model("Product", ProductSchema);

const SaleSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  transactionDate: { type: Date, required: true },
});
const Sale = mongoose.model("Sale", SaleSchema);

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    const products = [
      {
        id: 1,
        name: "Product A",
        category: "Category X",
        purchase_price: 10.99,
      },
      {
        id: 2,
        name: "Product B",
        category: "Category Y",
        purchase_price: 25.49,
      },
      {
        id: 3,
        name: "Product C",
        category: "Category Z",
        purchase_price: 5.99,
      },
      {
        id: 4,
        name: "Product D",
        category: "Category X",
        purchase_price: 15.99,
      },
    ];
    await Product.insertMany(products);
    console.log("Product seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

const seedSales = async () => {
  try {
    await Sale.deleteMany();
    const sales = [
      {
        productId: 1,
        productName: "Product A",
        category: "Category X",
        quantity: 3,
        unitPrice: 10.99,
        customerName: "John Doe",
        transactionDate: new Date(),
      },
      {
        productId: 2,
        productName: "Product B",
        category: "Category Y",
        quantity: 2,
        unitPrice: 25.49,
        customerName: "Jane Smith",
        transactionDate: new Date(),
      },
      {
        productId: 3,
        productName: "Product C",
        category: "Category Z",
        quantity: 5,
        unitPrice: 5.99,
        customerName: "Alice Johnson",
        transactionDate: new Date(),
      },
      {
        productId: 4,
        productName: "Product D",
        category: "Category X",
        quantity: 1,
        unitPrice: 15.99,
        customerName: "Bob Brown",
        transactionDate: new Date(),
      },
    ];

    for (let i = 0; i < sales.length; i++) {
      sales[i].transactionDate.setDate(new Date().getDate() + i);
    }

    await Sale.insertMany(sales);
    console.log("Sales seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding sales:", error);
  } finally {
    mongoose.disconnect();
  }
};

const seedAll = async () => {
  await seedProducts();
  await seedSales();
};

seedAll();
