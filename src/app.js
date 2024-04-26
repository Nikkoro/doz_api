require("dotenv").config();
const fastify = require("fastify");
const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_URL;
const app = fastify();

mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const PriceListSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});
const PriceList = mongoose.model("PriceList", PriceListSchema);

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  purchase_price: { type: Number, required: true },
});
const Product = mongoose.model("Product", ProductSchema);

const SaleSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  transactionDate: { type: Date, required: true },
});
const Sale = mongoose.model("Sale", SaleSchema);

app.post("/price-lists", async (request, reply) => {
  try {
    const { price_list_data } = request.body;

    if (!Array.isArray(price_list_data)) {
      return {
        success: false,
        message: "Invalid price list data format. Expected an array.",
      };
    }

    if (price_list_data.length === 0) {
      return { success: false, message: "Price list data is empty." };
    }

    for (const item of price_list_data) {
      const { product_id, price } = item;

      const product = await Product.findOne({ id: product_id });
      if (!product) {
        return {
          success: false,
          message: `Product with id ${product_id} does not exist.`,
        };
      }

      const existingPriceListEntry = await PriceList.findOne({ product_id });

      if (existingPriceListEntry) {
        await PriceList.findOneAndUpdate({ product_id }, { price });
      } else {
        const product = await Product.findOne({ id: product_id });

        if (product) {
          await PriceList.create({
            product_id: product.id,
            name: product.name,
            price: price || product.purchase_price * 1.25,
          });
        }
      }
    }

    return { success: true, message: "Price list updated successfully" };
  } catch (error) {
    reply.code(500).send({
      success: false,
      message: "Failed to update price list",
      error: error.message,
    });
  }
});

app.get("/sales-reports", async (request, reply) => {
  try {
    const { start_date, end_date, product_id, category } = request.query;

    const startDate = new Date(`${start_date}T00:00:00.000Z`);
    const endDate = new Date(`${end_date}T23:59:59.999Z`);

    const query = {
      transactionDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (product_id) {
      query.productId = product_id;
    }

    if (category) {
      query.category = category;
    }

    const salesReports = await Sale.find(query);

    if (salesReports.length === 0) {
      return { success: false, message: "No sales reports found" };
    }

    return { success: true, sales_reports: salesReports };
  } catch (error) {
    reply.code(500).send({
      success: false,
      message: "Failed to retrieve sales reports",
      error: error.message,
    });
  }
});

const start = async () => {
  try {
    await app.listen({ port: 3001 });
    console.log("Server is running on http://localhost:3001");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
