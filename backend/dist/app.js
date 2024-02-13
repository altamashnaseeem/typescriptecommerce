"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myCache = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const features_1 = require("./utils/features");
const error_1 = require("./middlewares/error");
const products_1 = __importDefault(require("./routes/products"));
const order_1 = __importDefault(require("./routes/order"));
const payment_js_1 = __importDefault(require("./routes/payment.js"));
const stats_js_1 = __importDefault(require("./routes/stats.js"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const node_cache_1 = __importDefault(require("node-cache"));
const app = (0, express_1.default)();
(0, dotenv_1.config)({
    path: "./.env",
});
const port = process.env.PORT;
// const port=4000;
const mongoURI = process.env.MONGO_URL || "";
(0, features_1.connectDB)(mongoURI);
exports.myCache = new node_cache_1.default();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/product", products_1.default);
app.use("/api/v1/order", order_1.default);
app.use("/api/v1/payment", payment_js_1.default);
app.use("/api/v1/dashboard", stats_js_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use(error_1.errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
