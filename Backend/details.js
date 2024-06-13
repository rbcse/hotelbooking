import db from "./db.js";
let h_id;
let hotel_details;

const viewDetails = async (req,res)=>{
    h_id = req.query.id;
    const reviewArr = await db.query("SELECT * FROM customer_reviews WHERE hotel_id = $1",[h_id]);
    const cust_review = [];
    for(let i=0;i<reviewArr.rows.length;i++){
        let obj = {
            person_name : reviewArr.rows[i].person_name,
            review : reviewArr.rows[i].review
        }
        cust_review.push(obj);
    }
    hotel_details = req.query;
    res.render("viewdetails.ejs",{hotelDetails : hotel_details , cust_review:cust_review});
}

const addCustomerReview = async (req,res)=>{
    const person_name = req.body.person_name;
    const review = req.body.review;
    await db.query("INSERT INTO customer_reviews (hotel_id,review,person_name) VALUES ($1,$2,$3)",[h_id,review,person_name]);

    const reviewArr = await db.query("SELECT * FROM customer_reviews WHERE hotel_id = $1",[h_id]);
    const cust_review = [];
    for(let i=0;i<reviewArr.rows.length;i++){
        let obj = {
            person_name : reviewArr.rows[i].person_name,
            review : reviewArr.rows[i].review
        }
        cust_review.push(obj);
    }
    res.render("viewdetails.ejs",{hotelDetails : hotel_details , cust_review:cust_review});
}

export { viewDetails , addCustomerReview };