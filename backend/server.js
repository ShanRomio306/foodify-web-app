import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import restRoutes from "./routes/restRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import offerRoutes from "./routes/offerRoutes.js"
import menuRoutes from "./routes/menuRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import restOrder from "./routes/orderRoutes/restOrder.js"
import userOrder from "./routes/orderRoutes/userOrder.js"

const app = express();
dotenv.config();


app.use(cors({
  origin: URL,
  credentials: true
}));

app.use(express.json());

// app.get("/api/menu", (req,res) => {
//     res.send("1.Appam\n2.Chicken Curry\n3.Meals\n");
// })

app.use("/", userRoutes);
app.use("/", restRoutes);
app.use("/", paymentRoutes);
app.use("/", offerRoutes);
//app.use("/", orderRoutes)
app.use("/", menuRoutes);
app.use("/", cartRoutes);
app.use("/", authRoutes);
app.use("/", restOrder);
app.use("/", userOrder);


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
    console.log("Server Started on port 5001");
    });
});


//console.log("Hello")
