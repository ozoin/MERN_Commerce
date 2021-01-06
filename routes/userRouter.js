import express, { Router } from "express";
import mongoose from "mongoose";
import {validateSignupData, validateLoginData} from "../util/validators.js";
import User from "../modules/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import {auth} from "../middlewares/auth.js";
import Order from "../schemas/dbOrders.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import Promos from "../schemas/dbPromos.js";
const router = express();
var JWT_TOKEN = "password123";
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:"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"
    }
}));
router.post("/register", async (req,res)=> {
    //USER PRIMARY DATA
    const newUser = {
        email:req.body.email,
        password:req.body.password,
        role:req.body.role
       // confirmPassword:req.body.confirmPassword,
    };
    //USER PRIMARY DATA

    //VALIDATION
    const {valid,errors} = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);
    const existingUser = await User.findOne({email:newUser.email});
    if (existingUser) { 
         errors.email = 'This email is already taken';
         return res.status(400).json(errors); 
    }
    //VALIDATION

    //ENCRYPT PASSWORDS
    const salt = await bcrypt.genSalt(); //encrypt password, generated hash
    const passwordHash = await bcrypt.hash(newUser.password,salt);
    //ENCRYPT PASSWORDS

    //CREATE USER
    const user = new User({
        email: newUser.email,
        password: passwordHash,
        role:newUser.role
    });
    const savedUser = await user.save();
    transporter.sendMail({
        to:user.email,
        from:"hopos18885@chatdays.com",
        subject:"Signup success!",
        html: "<h1>Welcome to our service!</h1>"
    });
    res.json(savedUser);
    //CREATE USER
});

router.post("/login", async (req,res)=> {
    const loginData = {
        email:req.body.email,
        password:req.body.password
    };
    const {valid,errors} = validateLoginData(loginData);
    if (!valid) return res.status(400).json(errors);
    
    const user = await User.findOne({email:loginData.email});
    if (!user) {
        errors.email = "There is no such user with this email.";
        return res.status(400).json(errors);
    }
    const isMatch = await bcrypt.compare(loginData.password,user.password);
    if (!isMatch) {
        errors.password = "Wrong password. Try again";
        return res.status(400).json(errors)
    }
    const token = jwt.sign({id:user._id},JWT_TOKEN);//some token here?????
    res.json({
        token,
        user: {
            id:user._id,
           //email:user.email
        }
    })
});

router.delete("/delete",auth, async (req,res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({error:err.message})
    }
});

router.post("/tokenIsValid", async (req,res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token,JWT_TOKEN);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({error:err.message})
    }
});

router.get("/",auth,async (req,res) => {
    const user = await User.findById(req.user);
    res.json({
        email:user.email,
        id:user._id,
        role:user.role
    });
});

router.get("/orders/:userId", async (req,res) => {
    const order = await Order.find({buyerId:req.params.userId});
    res.json(order)
});
//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
router.post("/resetPassword",(req,res) => {
    crypto.randomBytes(32, (err,buffer) => {
        if (err) {console.log(err)}
        const token = buffer.toString("hex");
        User.findOne({email:req.body.email}).then(user=> {
            if (!user) {return res.status(422).json({msg:"User does not exist with that email"})};
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user.save().then((result) => {
                transporter.sendMail({
                    to:user.email,
                    from:"hopos18885@chatdays.com",
                    subject:"Password reset",
                    html: `<p>You have requested for a password reset</p>
                    <h5>Click this link <a href="http://localhost:3000/reset/${token}"></a> to reset password</h5>
                    `
                })
                res.json({msg:"Check your Email"})
            })
        })
    } )
})
router.get("/promoCode/:promoCode", async (req,res) => {
    try {
        const code = await Promos.find({code:req.params.promoCode});
        if (code.length) {
            return res.json(code)
        } else {
            return res.json({msg:"Wrong promo code!"})
        }
    } catch (err) {return res.json(err)};
})
router.post("/changeUserData/:userId", async (req,res) => {
    const changes = req.body;
    await User.findByIdAndUpdate(req.params.userId,{$set: changes}, function(err,result) {
        (err) ? res.send(err) : res.send(result);
    })
});
router.post("/changeUserPassword/:userId", async (req,res) => {
    const changedPassword = req.body;
    await User.findByIdAndUpdate(req.params.userId,{$set: changedPassword}, function(err,result) {
        (err) ? res.send(err) : res.send(result);
    })
});
export default router;