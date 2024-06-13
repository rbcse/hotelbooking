import db from "./db.js";

const BrowseHotels = async (req,res)=>{

    let queryParameters = [];
    if(req.query.userLocation){
        queryParameters.push(req.query.userLocation);
    }
    if(req.query.checkInDate && req.query.checkOutDate){
        queryParameters.push(req.query.checkInDate);
        queryParameters.push(req.query.checkOutDate);
    }

    let all_hotels = await db.query("SELECT * FROM hotels");

    if(queryParameters.length > 0){
        all_hotels = await db.query("SELECT * FROM hotels WHERE location = $1",[queryParameters[0].toLowerCase()]);
    }

    res.render("hotels.ejs",{hotelArr : all_hotels.rows , checkin : queryParameters[1],checkout:queryParameters[2]});
}

export { BrowseHotels };