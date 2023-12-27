import mongoose from "mongoose";


const  connectDB = async() => { 
    try {
        const connectionInstance  = await mongoose.connect(`${process.env.MONGODB_URL}`); 
        console.log("MONGODB connection success");
    } catch (error) {
        console.error("MONGODB connection Database Error",error);
        process.exit(1);///inbuilt function of node 
    }
}
export default connectDB;