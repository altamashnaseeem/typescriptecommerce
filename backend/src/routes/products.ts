import express from "express";
import { adminOnly } from "../middlewares/auth";
import { deleteProduct, getAdminProducts, getAllCategoriesProducts, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product";
import { singleUpload } from "../middlewares/multer";
const app=express.Router()

app.post("/new",adminOnly,singleUpload,newProduct)
 app.get("/latest",getLatestProducts)
 app.get("/all",getAllProducts)
app.get("/categories",getAllCategoriesProducts)
app.get("/admin-products",adminOnly,getAdminProducts)

app.get("/:id",getSingleProduct)
app.put("/:id",adminOnly,singleUpload,updateProduct)
app.delete("/:id",adminOnly,deleteProduct)




export default app;
