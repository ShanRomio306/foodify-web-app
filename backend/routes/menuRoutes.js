import express from 'express'
import { addMenuItem,updateMenuItem,deleteMenuItem,getMenuByRestaurant,getMenuItemById,updateMenuItemPrice,updateMenuItemStock} from '../controllers/menuController.js'



const router = express.Router();
router.post("/menu", addMenuItem )
router.put("/menu/:id", updateMenuItem)
router.delete("/menu/:id", deleteMenuItem)
router.get("/menu/:id", getMenuItemById)
router.get("/menu/rest/:id", getMenuByRestaurant)
router.put("/menu/:id/price", updateMenuItemPrice)
router.put("/menu/:id/stock", updateMenuItemStock)

//router.get("menu/rest/:id/categories, getMenuCategories")
// .patch(`/categories/${editingCategory._id}` update categories
// delete category delete(`/categories/${id}`);

export default router;