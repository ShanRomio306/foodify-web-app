import User from "../models/Users.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



export const registerUser = async (req,res) => {

  try{

    const { name,email,password,phone,address } = req.body

    if(!name || !email || !password){
      return res.status(400).json({
        message:"Name, email and password required"
      })
    }

    const existing = await User.findOne({email})

    if(existing){
      return res.status(400).json({
        message:"User already exists"
      })
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    })

    const token = jwt.sign(
      { id:user._id, role:user.role },
      process.env.JWT_SECRET,
      { expiresIn:"7d" }
    )

    res.json({ user, token })

  }catch(err){
    console.error(err)
    res.status(500).json({message:"Registration failed"})
  }

}



export const loginUser = async (req,res)=>{

  const { email, password } = req.body
  console.log(email)
  console.log(password)

  const user = await User.findOne({ email })

  if(!user)
    return res.status(401).json({message:"Invalid email "})

  const isMatch = await user.comparePassword(password)

  if(!isMatch)
    return res.status(401).json({message:"Invalid  password"})

  const token = jwt.sign(
    { id:user._id, role:user.role },
    process.env.JWT_SECRET,
    { expiresIn:"7d" }
  )

  res.json({
    token,
    user:{
      _id:user._id,
      name:user.name,
      email:user.email,
      role:user.role
    }
  })

}

export function logoutUser(req,res){
  res.json({message:"Logout successful"})
}

export const getUserProfile = async(req,res)=>{
  const user = await User.findById(req.user.id).select("-password")
  res.json(user)
}


export const updateUserProfile = async (req,res)=>{

  const user = await User.findById(req.user.id);

  if(!user){
    return res.status(404).json({message:"User not found"});
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  await user.save();

  res.json(user);
};

export async function changePassword(req,res){
  const {oldPassword,newPassword} = req.body
  const user = await User.findById(req.params.id)

  const valid = await bcrypt.compare(oldPassword,user.password)
  if(!valid) return res.status(401).json({message:"Wrong password"})

  user.password = await bcrypt.hash(newPassword,10)
  await user.save()

  res.json({message:"Password updated"})
}