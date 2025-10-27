// login.js
import { login } from "./firebase.js";

async function loginUser() {
  try {
    const user = await login("user1@test.com", "123456");
    console.log("Logged in user:", user.uid);
  } catch (err) {
    console.error("Login error:", err.message);
  }
}

loginUser();
