import Order from "../models/Order.js"
import User from "../models/Users.js"
import Rest from "../models/Restaurant.js"
import Menu from "../models/Menu.js"

export const getAdminDashboard = async(req,res)=>{

  try{

    const totalUsers = await User.countDocuments()

    const totalRestaurants = await Rest.countDocuments()

    const totalOrders = await Order.countDocuments()

    const totalMenuItems = await Menu.countDocuments()

    const orders = await Order.find()

    const revenue = orders.reduce(
      (sum,o)=>sum + o.amount,
      0
    )

    res.json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalMenuItems,
      revenue
    })

  }catch{

    res.status(500).json({message:"Dashboard error"})

  }

}