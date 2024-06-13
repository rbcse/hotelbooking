// Modules
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url"; 
import path from "path";
import bodyParser from "body-parser";
import { signin , signup } from "./user.js";
import session from "express-session";
import passport from "passport";
import db from "./db.js";
import { BrowseHotels } from "./hotels.js";
import { viewDetails , addCustomerReview } from "./details.js";
import Razorpay from "razorpay";
import { createOrder } from './payment.js'

// Variables
const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares
app.set("views",path.join(__dirname , "../Frontend/views"));
app.use(express.static(path.join(__dirname,"../Frontend/public")));
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({
    secret : "TOPSECRET",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 // 1day
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
let userName;
app.get("/",(req,res)=>{
    if(req.isAuthenticated()){
        userName = req.user.name;
        res.render("home.ejs" , {loginVariable:req.user.name});
    }
    else{
        res.redirect("/login");
    }
});

app.get("/about",(req,res)=>{
    if (req.isAuthenticated()) {
        res.render("about.ejs",{loginVariable: userName});
    } else {
        res.render("about.ejs", { loginVariable: "Login" });
    }
});

app.get("/login", async (req, res) => {
    if (req.isAuthenticated()) {
        const reservation = await db.query("SELECT * FROM reservations WHERE name = $1 AND email = $2",[req.user.name,req.user.email]);
        res.render("userprofile.ejs",{personName : req.user.name,personEmail:req.user.email , reservation : reservation.rows});
    } else {
        res.render("login.ejs", { loginVariable: "Login" });
    }
});

app.get("/logout",(req,res)=>{
    if (req.isAuthenticated()) {
        res.render("login.ejs");
    } 
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs" , {userMessage : ""});
})

app.post("/signupBookMyHotel",signup);
app.post("/loginBookMyHotel",signin);

app.get("/add",(req,res)=>{
    res.render("form.ejs");
})

app.post("/adddata",async (req,res)=>{
    await db.query("INSERT INTO hotels (image,name,location,rating,price) VALUES ($1,$2,$3,$4,$5)",[req.body.image,req.body.hotelname,req.body.location,req.body.rating,req.body.price]);
    res.render("form.ejs");
})

app.post("/addReview",addCustomerReview);

app.get("/browseallhotels",BrowseHotels);
app.get("/viewdetails",viewDetails);

app.post("/createOrder", createOrder);

app.get("/getOrderDetails", async (req, res) => {
    if(req.isAuthenticated()){
        const orderDetails = {
            order_id: req.query.order_id,
            amount: req.query.amount,
            status: true,
            name: req.user.name,
            hotel_name: req.query.hotelname,
            email: req.user.email,
            checkin: req.query.checkin,
            checkout: req.query.checkout
        };
        console.log(orderDetails);
        await db.query("INSERT INTO reservations (order_id, checkin, checkout, hotel_name, amount, status, name, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", 
            [orderDetails.order_id, orderDetails.checkin, orderDetails.checkout, orderDetails.hotel_name, (orderDetails.amount / 100), orderDetails.status, orderDetails.name, orderDetails.email]);
        res.redirect("/");
    }
    else{
        res.redirect("/login");
    }
});

app.listen(port,()=>{
    console.log("Server is started");
})