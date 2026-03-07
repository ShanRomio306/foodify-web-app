import Cart from "../models/Cart.js";

export async function getCart(req, res) {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ userId, items: [], amount: 0, quantity: 0 });

    cart.recalculate();
    await cart.save();

    return res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get cart" });
  }
}

export async function addToCart(req, res) {
  try {
    const { userId, productId, name, price, image, quantity = 1, restaurantId } = req.body;

    if (!userId || !productId || !name || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        restaurantId: restaurantId || undefined,
        items: [{ productId, name, price, image, quantity }],
      });
      cart.recalculate();
      await cart.save();
      return res.json(cart);
    }

    // Optional: enforce single restaurant cart
    // if (cart.restaurantId && restaurantId && String(cart.restaurantId) !== String(restaurantId)) {
    //   return res.status(409).json({ message: "Cart contains items from another restaurant" });
    // }
    // if (!cart.restaurantId && restaurantId) cart.restaurantId = restaurantId;

    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));

    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, image, quantity });
    }

    cart.recalculate();
    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
}

export async function updateCartItemQuantity(req, res) {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity == null || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be >= 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => String(i.productId) === String(productId));
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    cart.recalculate();
    await cart.save();
    return res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => String(i.productId) !== String(productId));

    cart.recalculate();
    await cart.save();

    return res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
}

export async function clearCart(req, res) {
  try {
    const { userId } = req.params;
    await Cart.deleteOne({ userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
}