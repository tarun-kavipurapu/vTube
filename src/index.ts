
import connectDB from "./db/index.js";
import dotenv from "dotenv";
//!may need to add --experimental-modules flag to run this file
dotenv.config({
    path:"./.env"
});
connectDB();




//here using a iffe to connec ti s aprofessional approach
// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`); 
//     } catch (error) {
//         console.error("Database Error",error);
//         throw error;
//     }


// })();