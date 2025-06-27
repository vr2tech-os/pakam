import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const url = "http://localhost:4000"; // ✅ Base URL for API

  // 🔄 Fetch all food items from backend
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    }
  };

  // 🔄 Load cart data from backend and convert it to object format
  const loadCartData = async () => {
    if (!token) return;
    try {
      const res = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { token },
      });

      if (res.data.success && Array.isArray(res.data.cartItems)) {
        const cartObject = {};
        res.data.cartItems.forEach(item => {
          cartObject[item._id] = item.quantity;
        });
        setCartItems(cartObject);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  // ➕ Add item to cart
  const addToCart = async (itemId, quantity = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity,
    }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId, quantity }, {
          headers: { token },
        });
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    }
  };

  // ➖ Remove one quantity from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updatedQty = (prev[itemId] || 0) - 1;
      if (updatedQty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: updatedQty };
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, {
          headers: { token },
        });
      } catch (err) {
        console.error("Remove from cart failed:", err);
      }
    }
  };

  // ❌ Remove item completely
  const removeItemCompletely = async (itemId) => {
    setCartItems((prev) => {
      const { [itemId]: _, ...rest } = prev;
      return rest;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, {
          headers: { token },
        });
      } catch (err) {
        console.error("Remove item completely failed:", err);
      }
    }
  };

  // 💰 Calculate total cart amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const item = food_list.find((food) => food._id === itemId);
      return item ? total + item.price * qty : total;
    }, 0);
  };

  // 🔁 Fetch food list once on first load
  useEffect(() => {
    fetchFoodList();
  }, []);

  // 🔁 Load cart when token changes (on login)
  useEffect(() => {
    if (token) {
      loadCartData();
    }
  }, [token]);

  // Provide context values
  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    getTotalCartAmount,
    setCartItems,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
