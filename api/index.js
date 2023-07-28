require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { connectDB } = require("../config/db");
const productRoutes = require("../routes/productRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const sliderRoutes = require("../routes/sliderRoutes");
const queryRoutes = require("../routes/queryRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const historyRoutes = require("../routes/historyRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const uploadRoutes = require("../routes/uploadRoutes");

const { isAuth, isAdmin } = require("../config/auth");

connectDB();
const app = express();

app.set("trust proxy", 1);

app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.use(cors());

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

//this for route will need for store front, also for admin dashboard
app.use("/api/products/", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/coupon/", couponRoutes);
app.use("/api/notification/", notificationRoutes);
app.use("/api/history/", historyRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/order/", isAuth, customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/currency/", currencyRoutes);
app.use("/api/language/", languageRoutes);uploadRoutes
app.use("/api/upload/", uploadRoutes);
app.use("/api/slider/", sliderRoutes);
app.use("/api/query/", queryRoutes);


//if you not use admin dashboard then these two route will not needed.
app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", isAuth, orderRoutes);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
