"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const order_1 = require("../controllers/order");
const app = express_1.default.Router();
app.post("/new", order_1.newOrder);
app.get("/my", order_1.myOrders);
// route - /api/v1/order/my
app.get("/all", auth_1.adminOnly, order_1.allOrders);
app
    .route("/:id")
    .get(order_1.getSingleOrder)
    .put(auth_1.adminOnly, order_1.processOrder)
    .delete(auth_1.adminOnly, order_1.deleteOrder);
exports.default = app;
