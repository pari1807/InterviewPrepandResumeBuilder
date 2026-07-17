import express from  "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Database connection 
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>res.send("Server is Live...."));
app.use('api/users',userRouter);

app.listen(PORT ,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})