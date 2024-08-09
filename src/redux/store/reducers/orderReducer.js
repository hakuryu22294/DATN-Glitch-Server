import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const place_order = createAsyncThunk(
  "order/place_order",
  async ({
    price,
    products,
    shipping_fee,
    items,
    shippingInfo,
    userId,
    navigate,
  }) => {
    console.log(price, products);
    try {
      console.log(shipping_fee);
      const { data } = await instanceApi.post("/order/place-order", {
        price,
        products,
        shipping_fee,
        items,
        shippingInfo,
        userId,
        navigate,
      });

      console.log(data.data);
      navigate("/payment", {
        state: {
          price: price + shipping_fee,
          items,
          orderId: data.data,
        },
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }
);

export const order_confirm = createAsyncThunk(
  "order/order_confirm",
  async ({ orderId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/order/seller/confirm-order/${orderId}`
      );
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_orders = createAsyncThunk(
  "order/get_orders",
  async ({ userId, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/order/get-orders/${userId}/${status}`
      );
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const get_order_details = createAsyncThunk(
  "order/get_order_details",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/order/get-order-details/${orderId}`
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const get_admin_orders = createAsyncThunk(
  "orders/get_admin_orders",
  async (
    { parPage, page, searchValue, status },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `order/admin/orders?page=${page}&searchValue=${searchValue}&parPage=${parPage}&status=${status.toLowerCase()}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const get_admin_order = createAsyncThunk(
  "orders/get_admin_order",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/admin/order/${orderId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const admin_order_status_update = createAsyncThunk(
  "orders/admin_order_status_update",
  async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `/admin/order-status/update/${orderId}`,
        info,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const get_seller_orders = createAsyncThunk(
  "orders/get_seller_orders",
  async (
    { parPage, page, searchValue, sellerId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/order/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}`,
        { withCredentials: true }
      );

      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const get_seller_order = createAsyncThunk(
  "orders/get_seller_order",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/order/seller/order/${orderId}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const seller_order_status_update = createAsyncThunk(
  "orders/seller_order_status_update",
  async ({ orderId, info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `order/seller/order-status/update/${orderId}`,
        info,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const orderReducer = createSlice({
  name: "order",
  initialState: {
    successMessage: "",
    errorMessage: "",
    totalOrder: 0,
    order: {},
    shopOrder: {},
    myOrders: [],
    shopOrders: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(place_order.pending, (state) => {
        state.loader = true;
      })
      .addCase(place_order.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(place_order.fulfilled, (state, { payload }) => {
        state.successMessage = payload?.message;
      })

      .addCase(get_orders.fulfilled, (state, { payload }) => {
        console.log(payload.data);
        state.myOrders = payload.data;
        state.totalOrder = payload.data.totalOrder;
      })

      .addCase(get_order_details.fulfilled, (state, { payload }) => {
        state.order = payload.data;
      })

      .addCase(get_admin_orders.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
        state.myOrders = payload.data.orders;
        state.totalOrder = payload.data.totalOrder;
      })
      .addCase(get_admin_order.fulfilled, (state, { payload }) => {
        state.order = payload.order;
      })
      .addCase(admin_order_status_update.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(admin_order_status_update.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })

      .addCase(get_seller_orders.fulfilled, (state, { payload }) => {
        state.shopOrders = payload.data.orders;
        state.totalOrder = payload.data.totalOrder;
      })
      .addCase(get_seller_order.fulfilled, (state, { payload }) => {
        state.shopOrder = payload.data;
      })

      .addCase(seller_order_status_update.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      });
  },
});
export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
