import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({

  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rest",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  quantity_available: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    default: ""
  },

  description: {
    type: String,
    default: ""
  },

  isAvailable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;