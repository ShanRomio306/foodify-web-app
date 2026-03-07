import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rest",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },

    description: { type: String, default: "", trim: true },

    discount: { type: Number, required: true, min: 0, max: 100 },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;