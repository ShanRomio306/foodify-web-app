import express from "express"
import mongoose from "mongoose"
import Payment from "../models/Payment.js"
import { Order } from "../models/Order.js"

export async function createPayment(req,res){
  const payment = new Payment(req.body)
  await payment.save()
  res.json(payment)
}

export async function verifyPayment(req,res){
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    {status:"Completed"},
    {new:true}
  )
  res.json(payment)
}

export async function paymentStatus(req,res){
  const payment = await Payment.findById(req.params.id)
  res.json(payment)
}

export async function refundPayment(req,res){
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    {status:"Refunded"},
    {new:true}
  )
  res.json(payment)
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

export async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    console.log("updatePaymentStatus hit:", id, paymentStatus);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    if (!["pending", "paid", "failed"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid paymentStatus" });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });

    return res.json(updated);
  } catch (err) {
    console.error("updatePaymentStatus error:", err);
    return res.status(500).json({ message: "Failed to update payment status" });
  }
}