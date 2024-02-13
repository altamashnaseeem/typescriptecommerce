import mongoose from "mongoose";
import { OrderItemType, invalidateCacheProps } from "../types/types";
import { Product } from "../models/product";
import { myCache } from "../app";

export const connectDB=(URI:string)=>{
    mongoose.connect(URI,
    {dbName:"Ecommerce_2024"})
    .then((c)=>console.log(`DB connected to http://localhost:4000`))
    .catch((e)=>console.log(e))
   

}

export const invalidateCache= async ({product,order,admin,userId,productId}:invalidateCacheProps)=>{
       if(product){
           const productKeys:string[] =[
            "latest-product",
            "all-categories",
            "admin-products",
            `single-product-${productId}`
           ];
           if (typeof productId === "string") productKeys.push(`product-${productId}`);

           if (typeof productId === "object")
             productId.forEach((i) => productKeys.push(`product-${i}`));
      myCache.del(productKeys)

       }
       if(order){
        const ordersKeys: string[] = [
          "all-orders",
          `my-orders-${userId}`,
          // `order-${orderId}`,
        ];
    
        myCache.del(ordersKeys);
       }
       if(admin){
        
       }
       
}


export const reduceStock = async (orderItems: OrderItemType[]) => {

    for (let i = 0; i < orderItems.length; i++) {
      const order = orderItems[i];
      const product = await Product.findById(order.productId);
      if (!product) throw new Error("Product Not Found");
      product.stock -= order.quantity;
      await product.save();
      

    }
  };