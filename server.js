import express from "express";
import mongoose from "mongoose";
import Products from "./schemas/dbProducts.js";
import Orders from "./schemas/dbOrders.js";
import Cors from "cors";
import { createRequire } from 'module';
import Users from "./routes/userRouter.js";
import Admin from "./routes/adminRouter.js";
import fileUpload from "express-fileupload";
const app = express();
const require = createRequire(import.meta.url);
const port = process.env.PORT || 8001;
const connection_url = `mongodb+srv://admin-commerce:05uNfNYK0o63tSjy@cluster0.0rncv.mongodb.net/commerceDB?retryWrites=true&w=majority`;
const { request, response } = require('express');
const stripe = require("stripe")('sk_test_51HbXvsCIUgYNGl2BAdE19Tjiw26d0lhHRdL5Ql6z13PikwbShhZTz91Pt4zfNnJx5mc3SBykQpLPr65YM4p93rRN009VEK5PoX');
//Middlewares
app.use(express.json());
app.use(fileUpload({
    useTempFiles:true
}));
app.use(Cors());
app.use("/users",Users); //PATH IS /USERS/(ROUTENAME)
app.use("/admin",Admin);
//DB Config
mongoose.connect(connection_url, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
});
app.get('/', (req,res) => {
    res.send('Hello to API');
});
//API Endpoints
app.post('/products',(req,res)=> {
    const dbProduct = req.body;
    Products.create(dbProduct, (err,data)=> {
        (err) ? res.status(500).send(err) : res.status(201).send(data);
    })
});
app.get('/products', (req,res)=> {
    Products.find((err,data)=> {
        (err) ? res.status(500).send(err) : res.status(200).send(data);
    })
});
app.post('/orders', (req,res)=> {
    const order = req.body;
    Orders.create(order, (err,data) => {
        (err) ? res.status(500).send(err) : res.status(201).send(data);
    })
});
app.get('/orders',(req,res) => {
    Orders.find((err,data) => {
        (err) ? res.status(500).send(err) : res.status(200).send(data);
    })
});
app.post('/payment/create', async(request,response) => {
    const total = Math.round(request.query.total);
    console.log('Payment request recieved',total);
    const paymentIntent = await stripe.paymentIntents.create({
        amount:total,
        currency:"usd"
    });
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
});

//Listener
app.listen(port,()=> console.log(`listening on localhost: ${port}`));



//mongoDB login user
//admin-commerce
//05uNfNYK0o63tSjy

//RUN SERVER 
// nodemon server.js