import express, { Router } from "express";
import mongoose from "mongoose";
import {validateSignupData, validateLoginData} from "../util/validators.js";
import User from "../modules/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import {auth} from "../middlewares/auth.js";
import {authAdmin} from "../middlewares/authAdmin.js";
import cloudinary from "cloudinary";
import fs from "fs";
import Products from "../schemas/dbProducts.js";
import Order from "../schemas/dbOrders.js";
import Promos from "../schemas/dbPromos.js";
const router = express();

//--------------//
var CLOUD_NAME = "dh5rvhuux";
var CLOUD_API_KEY = "766348643561526";
var CLOUD_API_SECRET = "AGQ7VccZkcnErBSlQlyRGYgmIRE";
cloudinary.config({
    cloud_name:CLOUD_NAME,
    api_key:CLOUD_API_KEY,
    api_secret:CLOUD_API_SECRET
});
//--------------//
//auth, authAdmin,
router.post('/upload',auth, authAdmin, (req,res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {return res.status(400).json({msg:'No files were uploaded'})};      
        const file = req.files.file;
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({msg:"File format is incorrect"})
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder:"test"}, async (err,result) => {
            if (err) throw err;
            removeTmp(file.tempFilePath);
            return res.json({url:result.secure_url});
            //here we get public_id and url with image path
        });
    } catch (err) {
        return res.status(500).json({msg:err.message});
    }
});

router.delete('/deleteProduct/:productId',auth, authAdmin, async (req,res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.productId);
        return res.json({msg:"You deleted a product"});
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
})
router.post("/orders/:orderId",auth, authAdmin, (req,res) => {
        const status = req.body;
    Order.findByIdAndUpdate(req.params.orderId,{$set: status},function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
});
router.delete("/deleteOrder/:orderId",auth, authAdmin, async (req,res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.orderId);
        return res.json({msg:"You deleted an order"})
    } catch (err) {
        return res.status(500).json({msg:err.message});
    }
});
router.post("/newDiscountCode", (req,res) => {
    const discountCode = req.body;
    Promos.create(discountCode, (err,data) => {
        (err) ? res.status(500).send(err) : res.status(201).send(data);
    })
});
router.get("/promoCodes", (req,res) => {
    Promos.find((err,data) => {
        (err) ? res.status(500).send(err) : res.status(200).send(data)
    })
});
router.delete("/promoDelete/:promoCode", async (req,res)=> {
    try {
        await Promos.findOneAndDelete({"code":req.params.promoCode});
        return res.json({msg:"You deleted a promo"});
    } catch (err) {
        return err.status(500).json({msg:err.message})
    }
});
const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}

export default router;