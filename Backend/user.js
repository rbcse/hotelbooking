// Modules
import db from "./db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";

// Functions

let checkExistingUser = async (email) => {
    const db_results = await db.query("SELECT * FROM customers WHERE email = $1", [email]);

    if (db_results.rows.length > 0) {
        return db_results.rows[0];
    }
    return false;
}

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check for existing user
        if (await checkExistingUser(email)) {
            return res.render("signup.ejs", { userMessage: "User already exists, try login" });
        }

        // Create a user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO customers (name, email, password) VALUES ($1, $2, $3)", [username, email, hashedPassword]);

        console.log("Account created successfully");
        return res.render("login.ejs");

    } catch (err) {
        console.error(err);
        res.send(err);
    }
}

const signin = (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    })(req, res, next);
}

// Passport Local Strategy
passport.use(
    new Strategy(async function verify(username, password, cb) {
        try {
            const db_results = await db.query("SELECT * FROM customers WHERE email = $1", [username]);

            if (db_results.rows.length > 0) {
                const user = db_results.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return cb(null, user);
                } else {
                    return cb(null, false);
                }
            } else {
                return cb(null, false, { message: "User does not exist" });
            }
        } catch (err) {
            return cb(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user.id); // Assuming user has an id property
});

passport.deserializeUser(async (id, cb) => {
    try {
        const db_results = await db.query("SELECT * FROM customers WHERE id = $1", [id]);
        if (db_results.rows.length > 0) {
            cb(null, db_results.rows[0]);
        } else {
            cb(new Error("User not found"));
        }
    } catch (err) {
        cb(err);
    }
});

export { signin, signup };
