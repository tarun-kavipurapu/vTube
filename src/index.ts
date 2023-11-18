import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js"; 
//!may need to add --experimental-modules flag to run this file
dotenv.config({
  path: "./.env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT||8000, () => {
      console.log(`Server running on port ${process.env.PORT||8000}`);
    });

  })
  .catch((error) => {
    console.error("DB connection error",error);
    process.exit(1);
  });

//here using a iffe to connec ti s aprofessional approach
// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     } catch (error) {
//         console.error("Database Error",error);
//         throw error;
//     }

// })();
