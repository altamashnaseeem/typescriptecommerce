import { rm } from "fs";
import { TryCatch } from "../middlewares/error";
import { Request } from "express";
import { Product } from "../models/product";
import {faker} from "@faker-js/faker";

import { BaseQuery, ControllerType, NewProductRequestBody, SearchRequestQuery } from "../types/types";
import ErrorHandler from "../utils/utility-class";
import { myCache } from "../app";
import { invalidateCache } from "../utils/features";

// Revalidate on new,update and delete new order
export const getLatestProducts=TryCatch(async(req,res,next)=>{
   let products;
   if(myCache.has("latest-product")){
       products=JSON.parse(myCache.get("latest-product") as string)
   }
   else{
    products=await Product.find({}).sort({createdAt:-1}).limit(5)
    myCache.set("latest-product",JSON.stringify(products))

   }

    return res.status(200).json({
      success:true,
      products
    })
})
// Revalidate on new,update and delete new order
export const getAllCategoriesProducts=TryCatch(async(req,res,next)=>{
  
  let categories;
  if(myCache.has("all-categories")){
    categories=JSON.parse(myCache.get("all-categories") as string)
  }else{
    categories=await Product.distinct("all-categories");
    myCache.set("all-categories",JSON.stringify(categories))
  }

   
  return res.status(200).json({
    success:true,
    categories
  })
})


// Revalidate on new,update and delete new order

export const getAdminProducts=TryCatch(async(req,res,next)=>{

  let products;
  if(myCache.has("admin-products")){
    products=JSON.parse(myCache.get("admin-products") as string)

  }else{
    products=await Product.find({});
    myCache.set("admin-products",JSON.stringify(products))

  }


  

  return res.status(200).json({
    success:true,
    products
  })
})
export const getSingleProduct=TryCatch(async(req,res,next)=>{
  const id=req.params.id;
  let product;
   if(myCache.has(`single-product-${id}`)){
    product=JSON.parse(myCache.get(`single-product-${id}`) as string)
   }else{
    product=await Product.findById(id);
    if(!product){
      return next(new ErrorHandler("invalid id",400))
    }
    myCache.set(`single-product-${id}`,JSON.stringify(product))
   }
   
  
  return res.status(200).json({
    success:true,
    product
  })
})

export const newProduct=TryCatch(async(req,res,next)=>{
  const {name,price,stock,category}=req.body;
  const photo=req.file;
  if(!photo) return next(new ErrorHandler("please add photo",400))
  if(!name || !price || !stock || !category){
    rm(photo.path,()=>{
        console.log("deleted")
    })
    return next(new ErrorHandler("please enter all fields",400))
  }
  await Product.create({
      name,
      price,
      stock,
      category:category.toLowerCase(),
      photo:photo?.path
  });
  await  invalidateCache({product: true});
  
 
  return res.status(201).json({
    success:true,
    message:"product created successfully"
  })


})

export const updateProduct=TryCatch(async(req,res,next)=>{

   const {id}=req.params;
   const {name,price,stock,category}=req.body;
   const photo=req.file;
   const product=await Product.findById(id);
   
   
   if(!product){
    return next(new ErrorHandler("product not found",404));
     
   }
  
 if(photo){
  rm(product.photo,()=>{
    console.log("old photo deleted")
  });
  product.photo=photo.path;

}

  if(name){
    product.name=name;
  } 
  if(price) product.price=price;
  if(stock) product.stock=stock;
  if(category) product.category=category;

  
  await product.save();
  await  invalidateCache({product: true,productId:String(product._id)});
  
  return res.status(200).json({
    success:true,
    message:"Product Updated Successfully"
  })

 } )


export const deleteProduct=TryCatch(async(req,res,next)=>{
  const {id}=req.params;
  const product=await Product.findById(id);

  if(!product){
    return next(new ErrorHandler("product not found",404));

   }
  rm(product.photo!,()=>{
    console.log("Product Photo Deleted")
  });
  
  await Product.deleteOne();
  
  await  invalidateCache({product: true,productId:String(product._id)});
  return res.status(200).json({
    success:true,
    message:"Product deleted Successfully"
  })
});


export const getAllProducts=TryCatch(async(req:Request<{},{},{},SearchRequestQuery>,res,next)=>{
  const {search,sort,category,price}=req.query;
   const page=Number(req.query.page) || 1;
   const limit=Number(process.env.PRODUCT_PER_PAGE )|| 8;
  const skip=limit*(page-1);

 const baseQuery:BaseQuery={
 
  
}
if(search){
  baseQuery.name={
    $regex:search,
    $options:"i",
  };
   
}

if(price){
     baseQuery.price={
      $lte:Number(price)
     }
}
if(category) baseQuery.category=category;
const productsPromise= Product.find(baseQuery)
.sort(sort && {price:sort==="asc"?1:-1})
.limit(limit)
.skip(skip)

const [products,filteredOnlyProduct] = await Promise.all([
 productsPromise,
  Product.find(baseQuery)
])


const totalPage=Math.ceil(filteredOnlyProduct.length/limit);
  
  return res.status(200).json({
    success:true,
    products,
    totalPage,

  
  })
})

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






