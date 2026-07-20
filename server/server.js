import express from  "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import resumeRouter from "./routes/resumeRouter.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Database connection 
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>res.send("Server is Live...."));
app.use('/api/users',userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai',aiRouter);

app.listen(PORT ,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})