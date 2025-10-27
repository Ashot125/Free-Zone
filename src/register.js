// register.js
import { register } from "./firebase.js";

async function registerUser() {
  try {
    const user = await register("user1@test.com", "123456", "John Doe");
    console.log("User registered:", user.uid);
  } catch (err) {
    console.error("Registration error:", err.message);
  }
}

registerUser();
