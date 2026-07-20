import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Database Connected Successfully");
        });

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'ResumeBuilder';

        if (!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set");
        }

        let connectionURI = mongodbURI;
        if (connectionURI.includes('?')) {
            const [base, query] = connectionURI.split('?');
            let cleanBase = base;
            if (cleanBase.endsWith('/')) {
                cleanBase = cleanBase.slice(0, -1);
            }
            connectionURI = `${cleanBase}/${projectName}?${query}`;
        } else {
            if (connectionURI.endsWith('/')) {
                connectionURI = connectionURI.slice(0, -1);
            }
            connectionURI = `${connectionURI}/${projectName}`;
        }

        await mongoose.connect(connectionURI);
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }
};

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