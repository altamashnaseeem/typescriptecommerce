"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const product_1 = require("../controllers/product");
const multer_1 = require("../middlewares/multer");
const app = express_1.default.Router();
app.post("/new", auth_1.adminOnly, multer_1.singleUpload, product_1.newProduct);
app.get("/latest", product_1.getLatestProducts);
app.get("/all", product_1.getAllProducts);
app.get("/categories", product_1.getAllCategoriesProducts);
app.get("/admin-products", auth_1.adminOnly, product_1.getAdminProducts);
app.get("/:id", product_1.getSingleProduct);
app.put("/:id", auth_1.adminOnly, multer_1.singleUpload, product_1.updateProduct);
app.delete("/:id", auth_1.adminOnly, product_1.deleteProduct);
exports.default = app;
