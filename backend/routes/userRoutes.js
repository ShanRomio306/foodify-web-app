import express from 'express'
import { registerUser,loginUser,logoutUser,getUserProfile,deleteUser,updateUserProfile,changePassword, getAllUsers } from '../controllers/userController.js'
import authMiddleware from '../middleware/authenticate.js';


const router = express.Router();
router.delete("/users/:id", deleteUser);
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUser);
router.get("/users/profile",authMiddleware,getUserProfile);
router.patch("/users/profile",authMiddleware,updateUserProfile);
router.put("/users/:id/password", changePassword);
router.get("/users",getAllUsers);

export default router;