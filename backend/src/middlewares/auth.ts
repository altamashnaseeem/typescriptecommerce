// middleware to make sure only admin is allowed

import { User } from "../models/user";
import ErrorHandler from "../utils/utility-class";
import { TryCatch } from "./error";

export const adminOnly=TryCatch(async(req,res,next)=>{
   const {id}=req.query;
   if(!id) return next(new ErrorHandler("please do login",401));

  const user=await User.findById(id);
  if(!user) return next(new ErrorHandler("ID is invalid",401))

  if(user.role!=="admin")
  return next(new ErrorHandler("you are not admin",401))

  next();
  
})

