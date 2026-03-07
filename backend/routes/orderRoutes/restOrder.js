import express from 'express'
import { getOrderById } from '../../controllers/orderController.js'


const router = express.Router();
router.get("/order/:id",getOrderById)

export default router;