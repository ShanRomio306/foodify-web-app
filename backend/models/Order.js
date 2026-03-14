import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rest",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      default: [],
    },

    amount: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["placed", "accepted", "preparing", "ready", "completed", "cancelled"],
      default: "placed",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    note: {
      type: String,
    },
  },
  { timestamps: true }
);

orderSchema.methods.recalculate = function () {
  this.quantity = this.items.reduce((sum, i) => sum + i.quantity, 0);
  this.amount = this.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  this.subtotal = this.amount;
  this.tax = this.subtotal * 0.1;
  this.total = this.subtotal + this.tax;
};

export const Order = mongoose.model("Order", orderSchema);