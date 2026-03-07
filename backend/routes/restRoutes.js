import express from 'express'
import { addRestaurant,updateRestaurant,deleteRestaurant,getRestaurantById,getAllRestaurants,approveRestaurant } from '../controllers/restController.js'



const router = express.Router();
router.post("/rests", addRestaurant);
router.get("/rests/:id", getRestaurantById);
router.get("/rests", getAllRestaurants)
router.put("/rest/:id", updateRestaurant);
router.delete("/rest/:id", deleteRestaurant);
router.patch("/:id/approve",approveRestaurant)




export default router;