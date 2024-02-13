"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.newProduct = exports.getSingleProduct = exports.getAdminProducts = exports.getAllCategoriesProducts = exports.getLatestProducts = void 0;
const fs_1 = require("fs");
const error_1 = require("../middlewares/error");
const product_1 = require("../models/product");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const app_1 = require("../app");
const features_1 = require("../utils/features");
// Revalidate on new,update and delete new order
exports.getLatestProducts = (0, error_1.TryCatch)(async (req, res, next) => {
    let products;
    if (app_1.myCache.has("latest-product")) {
        products = JSON.parse(app_1.myCache.get("latest-product"));
    }
    else {
        products = await product_1.Product.find({}).sort({ createdAt: -1 }).limit(5);
        app_1.myCache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products
    });
});
// Revalidate on new,update and delete new order
exports.getAllCategoriesProducts = (0, error_1.TryCatch)(async (req, res, next) => {
    let categories;
    if (app_1.myCache.has("all-categories")) {
        categories = JSON.parse(app_1.myCache.get("all-categories"));
    }
    else {
        categories = await product_1.Product.distinct("all-categories");
        app_1.myCache.set("all-categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories
    });
});
// Revalidate on new,update and delete new order
exports.getAdminProducts = (0, error_1.TryCatch)(async (req, res, next) => {
    let products;
    if (app_1.myCache.has("admin-products")) {
        products = JSON.parse(app_1.myCache.get("admin-products"));
    }
    else {
        products = await product_1.Product.find({});
        app_1.myCache.set("admin-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products
    });
});
exports.getSingleProduct = (0, error_1.TryCatch)(async (req, res, next) => {
    const id = req.params.id;
    let product;
    if (app_1.myCache.has(`single-product-${id}`)) {
        product = JSON.parse(app_1.myCache.get(`single-product-${id}`));
    }
    else {
        product = await product_1.Product.findById(id);
        if (!product) {
            return next(new utility_class_1.default("invalid id", 400));
        }
        app_1.myCache.set(`single-product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product
    });
});
exports.newProduct = (0, error_1.TryCatch)(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new utility_class_1.default("please add photo", 400));
    if (!name || !price || !stock || !category) {
        (0, fs_1.rm)(photo.path, () => {
            console.log("deleted");
        });
        return next(new utility_class_1.default("please enter all fields", 400));
    }
    await product_1.Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo?.path
    });
    await (0, features_1.invalidateCache)({ product: true });
    return res.status(201).json({
        success: true,
        message: "product created successfully"
    });
});
exports.updateProduct = (0, error_1.TryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await product_1.Product.findById(id);
    if (!product) {
        return next(new utility_class_1.default("product not found", 404));
    }
    if (photo) {
        (0, fs_1.rm)(product.photo, () => {
            console.log("old photo deleted");
        });
        product.photo = photo.path;
    }
    if (name) {
        product.name = name;
    }
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    await (0, features_1.invalidateCache)({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "Product Updated Successfully"
    });
});
exports.deleteProduct = (0, error_1.TryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const product = await product_1.Product.findById(id);
    if (!product) {
        return next(new utility_class_1.default("product not found", 404));
    }
    (0, fs_1.rm)(product.photo, () => {
        console.log("Product Photo Deleted");
    });
    await product_1.Product.deleteOne();
    await (0, features_1.invalidateCache)({ product: true, productId: String(product._id) });
    return res.status(200).json({
        success: true,
        message: "Product deleted Successfully"
    });
});
exports.getAllProducts = (0, error_1.TryCatch)(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price)
        };
    }
    if (category)
        baseQuery.category = category;
    const productsPromise = product_1.Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        product_1.Product.find(baseQuery)
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\c649b475-8526-4922-abbd-44b836d8977b.jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ succecss: true });
// };
// generateRandomProducts(40);
// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
// deleteRandomsProducts(40)
