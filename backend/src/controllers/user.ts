import { Request, Response, NextFunction } from "express";
import { NewUserRequestBody } from "../types/types";
import { User } from "../models/user";

import { TryCatch } from "../middlewares/error";
import ErrorHandler from "../utils/utility-class";
export const newUser = TryCatch(async (
  req: Request<{},{},NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {

  
    //return next(new ErrorHandler("my custom error",402));
    // throw new Error("this is error")
    
    const {name,email,photo,gender,_id,dob} = req.body;
    let user=await User.findById(_id);
    if(user){
      return res.status(200).json({
        success:true,
        message:`Welcome ${user.name}`
      })
    }

      if(!_id || !name || !email || !photo || !gender || !dob){
        next(new ErrorHandler("please add all fields",400))
      }
     user = await User.create({name,email,photo,gender,_id,dob});

    return res.status(201).json({
      success: true,
      message: `Welcome,${user.name}`,
    });
 
});

export const getAllUsers=TryCatch(async(req,res,next)=>{
  const users=await User.find({});
  return res.status(201).json({
    success:true,
    users
  })
})

export const getUser=TryCatch(async(req,res,next)=>{
  const user=await User.findById(req.params.id);
  if(!user) return next(new ErrorHandler("invalid id",400));
   return res.status(201).json({
       success:true,
       user
   })
})

export const deleteUser=TryCatch(async(req,res,next)=>{
  const user=await User.findById(req.params.id);
   if(!user) return next(new ErrorHandler("Invalid ID",400));

   await user.deleteOne();
   return res.status(200).json({
    success:true,
    message:"User Deleted Successfully"
   })
})
