// main libs
const express = require("express");
const cors = require("cors");
const app = express();
// require middlewares files
const { ErrorNotFound, CatchError } = require("./middlewares/errors")
const GetRequest = require("./middlewares/getRequest");
// cors use
app.use(cors());
// use json in express
app.use(express.json())
// exports values #env
const { PORT, HOST } = require("./values/env");
// connection data base
const connectDB = require("./config/connectDB");
connectDB();
// Get Request middleware
app.use(GetRequest);
// GET routes path
const test = require("./routes/test");
const customerRoutes = require("./routes/customer/customer");
const customerAuth = require("./routes/customer/auth/auth");
const ProductRoutes = require("./routes/product/productRoute");
const SellsProducts = require("./routes/product/sells");
const BuysProducts = require("./routes/product/buys");
const DeleteProducts = require("./routes/product/delete");
const MoneySystem = require("./routes/money/money")
const AuthOwner = require("./routes/owner/auth/auth")
// Routes
app.use("/api", test);
app.use("/api/customer", customerRoutes);
app.use("/api/auth", customerAuth);
app.use("/api/product/route", ProductRoutes);
app.use("/api/sells", SellsProducts);
app.use("/api/buys", BuysProducts);
app.use("/api/delete_product", DeleteProducts);
app.use("/api/money/control", MoneySystem);
app.use("/api/owner/auth", AuthOwner)

// middlewares Error handler
app.use(ErrorNotFound);
app.use(CatchError);


app.listen(PORT, HOST, () => console.log(`Server Run in host ${HOST} in port ${PORT}`));