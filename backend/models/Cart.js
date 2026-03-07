import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // add because frontend uses it
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Make optional unless you truly enforce it
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Rest", required: false },

    items: { type: [cartItemSchema], default: [] },

    // compute these values, don't require them
    amount: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// keep totals consistent
cartSchema.methods.recalculate = function () {
  this.quantity = this.items.reduce((sum, i) => sum + i.quantity, 0);
  this.amount = this.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
};

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;