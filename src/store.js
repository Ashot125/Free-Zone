// src/store/store.js
import { reactive } from 'vue';

export const store = reactive({
  favorites: [],  // Favorites
  cart: [],       // Items in cart
  orders: [],     // Already purchased items

  // delivery address
  deliveryAddress: {
    text: "",        // address manually
    location: null   // coordinates from the map { lat, lng }
  },
  search: "" // search string field
});
