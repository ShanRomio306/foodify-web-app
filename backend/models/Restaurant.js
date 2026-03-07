import mongoose from "mongoose";

const restSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: "A place to buy food"
  },

  image: {
    type: String,
    default:
      "https://imgs.search.brave.com/Vy4WHqPe05wvJuE6hMA9DlTIKItWXh9_PFy8tk7Qz4s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRpYS5pc3RvY2twaG90by5jb20vaWQvMTc0NTg5NTM3OC9waG90by93ZXN0ZXJuLXJl/c3RhdXJhbnQtbWVu/dS1zYW1wbGUuanBn"
  },

  address: {
    type: String,
    default: "Location not specified"
  },

  cuisines: [
    {
      type: String
    }
  ],

  rating: {
    type: Number,
    default: 4
  },

  totalReviews: {
    type: Number,
    default: 0
  },

  avgDeliveryTime: {
    type: String,
    default: "30 mins"
  },

  minOrder: {
    type: Number,
    default: 10
  },
  open : {
    type: Boolean,
    default : true ,
  },

  
  
},
{ timestamps: true }
);

const Rest = mongoose.model("Rest", restSchema);

export default Rest;