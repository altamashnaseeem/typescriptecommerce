"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceStock = exports.invalidateCache = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const product_1 = require("../models/product");
const app_1 = require("../app");
const connectDB = (URI) => {
    mongoose_1.default.connect(URI, { dbName: "Ecommerce_2024" })
        .then((c) => console.log(`DB connected to http://localhost:4000`))
        .catch((e) => console.log(e));
};
exports.connectDB = connectDB;
const invalidateCache = async ({ product, order, admin, userId, productId }) => {
    if (product) {
        const productKeys = [
            "latest-product",
            "all-categories",
            "admin-products",
            `single-product-${productId}`
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        app_1.myCache.del(productKeys);
    }
    if (order) {
        const ordersKeys = [
            "all-orders",
            `my-orders-${userId}`,
            // `order-${orderId}`,
        ];
        app_1.myCache.del(ordersKeys);
    }
    if (admin) {
    }
};
exports.invalidateCache = invalidateCache;
const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await product_1.Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
exports.reduceStock = reduceStock;
