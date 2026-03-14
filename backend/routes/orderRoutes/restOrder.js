import express from 'express'
import { getOrderById, getOrdersByRestaurant } from '../../controllers/orderController.js'


const router = express.Router();
//router.get("/order/:id",getOrderById)

router.get("/orders/restaurant/:restaurantId", getOrdersByRestaurant);
router.get("/order/:id", getOrderById);

export default router;