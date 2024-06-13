import pg from "pg";

const db = new pg.Client({
    host:"localhost",
    user:"postgres",
    database:"bookmyhotel",
    password:"rahul",
    port:5432
});
db.connect();

export default db;