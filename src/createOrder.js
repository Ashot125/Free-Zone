// createOrder.js
import { login, getProducts, createOrder } from "./firebase.js";

async function makeOrder() {
  try {
    // 1.Log in
    const user = await login("user1@test.com", "123456");

    // 2.We receive a list of products
    const products = await getProducts();
    if (products.length === 0) {
      console.log("No products available!");
      return;
    }

    // 3. We create an order for the first product
    const order = await createOrder({
      userId: user.uid,
      productId: products[0].id,
      quantity: 2,
    });

    console.log("Order created:", order);
  } catch (err) {
    console.error("Error creating order:", err.message);
  }
}

makeOrder();
