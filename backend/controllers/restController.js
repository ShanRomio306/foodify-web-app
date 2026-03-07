import Restaurant from "../models/Restaurant.js"

export async function addRestaurant(req,res){
  const rest = new Restaurant(req.body)
  await rest.save()
  res.status(201).json(rest)
}

export async function updateRestaurant(req,res){
  const rest = await Restaurant.findByIdAndUpdate(req.params.id,req.body,{new:true})
  res.json(rest)
}

export async function deleteRestaurant(req,res){
  await Restaurant.findByIdAndDelete(req.params.id)
  res.json({message:"Restaurant deleted"})
}

export async function getRestaurantById(req,res){
  const rest = await Restaurant.findById(req.params.id)
  res.json(rest)
}

export async function getAllRestaurants(req,res){
  const rest = await Restaurant.find()
  res.json(rest)
}

export async function openRestaurant(req,res){
  const rest = await Restaurant.findByIdAndUpdate(req.params.id,{open:true},{new:true})
  res.json(rest)
}

export async function closeRestaurant(req,res){
  const rest = await Restaurant.findByIdAndUpdate(req.params.id,{open:false},{new:true})
  res.json(rest)
}

export async function updateRestaurantTimings(req,res){
  const {open_at,close_at} = req.body
  const rest = await Restaurant.findByIdAndUpdate(req.params.id,{open_at,close_at},{new:true})
  res.json(rest)
}

export const approveRestaurant = async(req,res)=>{

  try{

    const restaurant = await Rest.findById(req.params.id)

    if(!restaurant)
      return res.status(404).json({message:"Restaurant not found"})

    restaurant.approved = true

    await restaurant.save()

    res.json(restaurant)

  }catch{

    res.status(500).json({message:"Approval failed"})

  }

}