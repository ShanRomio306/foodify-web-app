import express from 'express'
import { registerUser,loginUser,logoutUser,getUserProfile,updateUserProfile,changePassword } from '../controllers/userController.js'
import authMiddleware from '../middleware/authenticate.js';


const router = express.Router();
router.post("/users", registerUser);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUser);
router.get("/users/profile",authMiddleware,getUserProfile);
router.patch("/users/profile",authMiddleware,updateUserProfile);
router.put("/users/:id/password", changePassword);


export default router;