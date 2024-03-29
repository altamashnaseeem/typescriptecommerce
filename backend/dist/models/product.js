"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "please enter name"]
    },
    photo: {
        type: String,
        required: [true, "please enter photo"]
    },
    price: {
        type: Number,
        required: [true, "please enter price"]
    },
    stock: {
        type: Number,
        required: [true, "please enter stock"]
    },
    category: {
        type: String,
        required: [true, "please enter category of product"],
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Product = mongoose_1.default.model("Product", productSchema);
