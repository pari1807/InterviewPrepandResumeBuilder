import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> {console.log("Database Connected Successfully")})

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'ResumeBuilder'

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set");
        }

        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1);
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`)
    }catch(error){
        console.error("Error connecting to MongoDB: ", error)
    }
}

export default connectDB;

// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     console.log("URI:", process.env.MONGODB_URI);

//     const conn = await mongoose.connect(process.env.MONGODB_URI);

//     console.log("MongoDB Connected Successfully");
//     console.log("Host:", conn.connection.host);
//     console.log("Database:", conn.connection.name);

//   } catch (err) {
//     console.error("FULL ERROR:");
//     console.error(err);
//     process.exit(1);
//   }
// };

// export default connectDB;