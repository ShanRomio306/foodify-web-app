import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Error in connectiing Database");
        process.exit(1)
    }
}