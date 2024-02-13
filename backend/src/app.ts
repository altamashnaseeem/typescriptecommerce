import express, { Request,Response,NextFunction } from "express";
import userRoutes from "./routes/user"
import { connectDB } from "./utils/features";
import { errorMiddleware } from "./middlewares/error";
import productRoutes from "./routes/products"
import orderRoutes from "./routes/order"
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import {config} from "dotenv"
import morgan from 'morgan'
import NodeCache from "node-cache"
const app=express();
config({
    path:"./.env",
});
 const port=process.env.PORT
// const port=4000;
const mongoURI=process.env.MONGO_URL || "";

connectDB(mongoURI);

export const myCache=new NodeCache()
app.use(express.json())
app.use(morgan("dev"))
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product",productRoutes);
app.use("/api/v1/order",orderRoutes);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/uploads",express.static("uploads"));
app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`)
});
