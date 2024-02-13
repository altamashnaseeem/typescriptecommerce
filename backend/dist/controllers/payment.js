"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.allCoupons = exports.applyDiscount = exports.newCoupon = void 0;
//import { stripe } from "../app.js";
const error_js_1 = require("../middlewares/error.js");
const coupon_js_1 = require("../models/coupon.js");
const utility_class_js_1 = __importDefault(require("../utils/utility-class.js"));
// export const createPaymentIntent = TryCatch(async (req, res, next) => {
//   const { amount } = req.body;
//   if (!amount) return next(new ErrorHandler("Please enter amount", 400));
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Number(amount) * 100,
//     currency: "inr",
//   });
//   return res.status(201).json({
//     success: true,
//     clientSecret: paymentIntent.client_secret,
//   });
// });
exports.newCoupon = (0, error_js_1.TryCatch)(async (req, res, next) => {
    const { code, amount } = req.body;
    if (!code || !amount)
        return next(new utility_class_js_1.default("Please enter both coupon and amount", 400));
    await coupon_js_1.Coupon.create({ code, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${code} Created Successfully`,
    });
});
exports.applyDiscount = (0, error_js_1.TryCatch)(async (req, res, next) => {
    const { coupon } = req.query;
    const discount = await coupon_js_1.Coupon.findOne({ code: coupon });
    if (!discount)
        return next(new utility_class_js_1.default("Invalid Coupon Code", 400));
    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
});
exports.allCoupons = (0, error_js_1.TryCatch)(async (req, res, next) => {
    const coupons = await coupon_js_1.Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
});
exports.deleteCoupon = (0, error_js_1.TryCatch)(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await coupon_js_1.Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new utility_class_js_1.default("Invalid Coupon ID", 400));
    return res.status(200).json({
        success: true,
        message: `Coupon  Deleted Successfully`,
    });
});
