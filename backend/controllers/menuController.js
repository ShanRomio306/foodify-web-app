import Menu from "../models/Menu.js"

export async function addMenuItem(req,res){
  const item = new Menu(req.body)
  await item.save()
  res.json(item)
}

export async function updateMenuItem(req,res){
  const item = await Menu.findByIdAndUpdate(req.params.id,req.body,{new:true})
  res.json(item)
}

export async function deleteMenuItem(req,res){
  await Menu.findByIdAndDelete(req.params.id)
  res.json({message:"Menu item removed"})
}

export async function getMenuByRestaurant(req,res){
  const menu = await Menu.find({rest_name:req.params.rest})
  res.json(menu)
}

export async function getMenuItemById(req,res){
  const item = await Menu.findById(req.params.id)
  res.json(item)
}

export async function enableMenuItem(req,res){
  const item = await Menu.findByIdAndUpdate(req.params.id,{enabled:true},{new:true})
  res.json(item)
}

export async function disableMenuItem(req,res){
  const item = await Menu.findByIdAndUpdate(req.params.id,{enabled:false},{new:true})
  res.json(item)
}

export async function updateMenuItemPrice(req,res){
  const item = await Menu.findByIdAndUpdate(req.params.id,{price:req.body.price},{new:true})
  res.json(item)
}

export async function updateMenuItemStock(req,res){
  const item = await Menu.findByIdAndUpdate(req.params.id,{quantity_available:req.body.quantity},{new:true})
  res.json(item)
}