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
// use urlencoded in express
app.use(express.urlencoded({ extended: true }));
// exports values #env
const { PORT, HOST } = require("./values/env");
// connection data base
const connectDB = require("./config/connectDB");
connectDB();
// start cron job
const startCronJob = require("./cronServer");
startCronJob();
// Get Request middleware
app.use(GetRequest);
// GET routes path
const customerRoutes = require("./routes/customer/customer");
const customerAuth = require("./routes/customer/auth/auth");
const ProductRoutes = require("./routes/product/productRoute");
const SellsProducts = require("./routes/product/sells");
const BuysProducts = require("./routes/product/buys");
const DeleteProducts = require("./routes/product/delete");
const ReportRoutes = require("./routes/Report/report");
const MoneySystem = require("./routes/money/money")
const AuthOwner = require("./routes/owner/auth/auth");
const OwnerRoutes = require("./routes/owner/owner");
const ProfileOfOwner = require("./routes/owner/profile/profile");
const UploadOwnerAvatar = require("./routes/owner/profile/avatar");
const AreaRoute = require("./routes/Area/area");
const RoomRoutes = require("./routes/Room/room");
const RentalRoutes = require("./routes/Rental/rental");
const ProfileOfCustomer = require("./routes/customer/profile/profile");
const UploadCustomerAvatar = require("./routes/customer/profile/avatar");
// Routes
app.use("/api/auth", customerAuth);
app.use("/api/customer", customerRoutes);
app.use("/api/customer/profile", ProfileOfCustomer);
app.use("/api/customer/profile/image", UploadCustomerAvatar);
app.use("/api/sells", SellsProducts);
app.use("/api/buys", BuysProducts);
app.use("/api/product/route", ProductRoutes);
app.use("/api/delete_product", DeleteProducts);
app.use("/api/report", ReportRoutes);
app.use("/api/money/control", MoneySystem);
app.use("/api/owner/auth", AuthOwner);
app.use("/api/owner", OwnerRoutes);
app.use("/api/owner/profile", ProfileOfOwner);
app.use("/api/owner/profile/image", UploadOwnerAvatar);
app.use("/api/owner/area", AreaRoute);
app.use("/api/room", RoomRoutes);
app.use("/api/rental", RentalRoutes);
// middlewares Error handler
app.use(ErrorNotFound);
app.use(CatchError);


app.listen(PORT, HOST, () => console.log(`Server Run in host ${HOST} in port ${PORT}`));