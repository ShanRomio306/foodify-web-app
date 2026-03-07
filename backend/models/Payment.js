import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    paymentId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"User",
        required : true,
    },
    amount : {
        type : Number,
        required : true ,
    },
    status: {
        type : String,
        required :true,
        enum : ["Completed","Not-Completed"],
        default : "Not-Completed",
    }
} , { timestamp : true })

const payment = new mongoose.model("payment",paymentSchema);
export default payment;