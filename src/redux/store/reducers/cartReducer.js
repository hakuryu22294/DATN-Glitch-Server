import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const add_to_card = createAsyncThunk(
  "card/add_to_card",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(info);
      const { data } = await instanceApi.post("/cart/add-to-cart", info);
      console.log(data.data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_card_products = createAsyncThunk(
  "cart/get_card_products",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/cart/${userId}`);
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const delete_card_product = createAsyncThunk(
  "cart/delete_card_product",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.delete(`/cart/delete-cart/${card_id}`);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const quantity_inc = createAsyncThunk(
  "cart/quantity-inc",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(`/cart/quantity-inc/${card_id}`);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const quantity_dec = createAsyncThunk(
  "card/quantity-dec",
  async (card_id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(`/cart/quantity-dec/${card_id}`);
      // console.log(data)
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// End Method

export const add_to_wishlist = createAsyncThunk(
  "wishlist/add_to_wishlist",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    console.log(info);
    try {
      const { data } = await instanceApi.post(`/wishlist/${info.userId}`, info);
      console.log(data);
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
// End Method

export const get_wishlist_products = createAsyncThunk(
  "wishlist/get_wishlist_products",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/wishlist/${userId}`);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
// End Method

export const remove_wishlist = createAsyncThunk(
  "wishlist/remove_wishlist",
  async (wishlistId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.delete(
        `/home/product/remove-wishlist-product/${wishlistId}`
      );
      // console.log(data)
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);
export const check_cart_before_buy = createAsyncThunk(
  "cart/check_cart_before_buy",
  async ({ cartItems }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post(`/cart/check-pre-order`, {
        cartItems,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const cartReducer = createSlice({
  name: "cart",
  initialState: {
    card_products: [],
    card_product_count: 0,
    wishlist_count: 0,
    wishlist: [],
    price: 0,
    errorMessage: "",
    successMessage: "",
    shipping_fee: 0,
    outofstock_products: [],
    buy_product_item: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    reset_count: (state) => {
      state.card_product_count = 0;
      state.wishlist_count = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(add_to_card.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        console.log(payload);
      })
      .addCase(add_to_card.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.card_product_count = state.card_product_count + 1;
      })

      .addCase(get_card_products.fulfilled, (state, { payload }) => {
        state.card_products = payload.cartProducts;
        state.price = payload.price;
        state.card_product_count = payload.productsCount;
        state.shipping_fee = payload.shippingFee;
        state.outofstock_products = payload.outOfStockProduct;
        state.buy_product_item = payload.buyItems;
      })

      .addCase(delete_card_product.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(quantity_inc.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.successMessage = payload.message;
      })
      .addCase(quantity_dec.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })

      .addCase(add_to_wishlist.rejected, (state, { payload }) => {
        state.errorMessage = payload.data.message;
        console.log(payload);
      })
      .addCase(add_to_wishlist.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.wishlist_count =
          state.wishlist_count > 0 ? state.wishlist_count + 1 : 1;
      })

      .addCase(get_wishlist_products.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.wishlist = payload.data;
        state.wishlist_count = payload.data.length;
      })

      .addCase(remove_wishlist.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.wishlist = state.wishlist.filter(
          (p) => p._id !== payload.wishlistId
        );
        state.wishlist_count = state.wishlist_count - 1;
      });
  },
});
export const { messageClear, reset_count } = cartReducer.actions;
export default cartReducer.reducer;
