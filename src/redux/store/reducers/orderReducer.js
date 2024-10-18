import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";
import toast from "react-hot-toast";

export const place_order = createAsyncThunk(
  "order/place_order",
  async ({
    price,
    products,
    shipping_fee,
    items,
    shippingInfo,
    userId,
    paymentMethod,
    navigate,
  }) => {
    try {
      console.log(shipping_fee);
      const { data } = await instanceApi.post("/order/place-order", {
        price,
        products,
        shipping_fee,
        items,
        shippingInfo,
        userId,
        paymentMethod,
        navigate,
      });

      if (paymentMethod === "vnPay") {
        navigate("/payment", {
          state: {
            price: price + shipping_fee,
            items,
            orderId: data.data,
          },
        });
      } else {
        navigate(`/return_COD/${data.data}`);
        toast.success("Order placed successfully");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }
);

// export const update_stock_products_in_orders = createAsyncThunk(
//   "order/update_stock_products_in_orders",
//   async ({ orderId }, { rejectWithValue, fulfillWithValue }) => {
//     try {
//       const { data } = await instanceApi.post(`/order/update-stock/${orderId}`);
//       return fulfillWithValue(data.data);
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const order_confirm = createAsyncThunk(
  "order/order_confirm",
  async ({ orderId, paymentMethod }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/order/seller/confirm-order/${orderId}/${paymentMethod}`
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

export const hand_over_orders_to_shipper = createAsyncThunk(
  "orders/hand_over_orders_to_shipper",
  async (
    { orderIds = [], shipperId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.post(
        `order/admin/hand-over`,
        {
          orderIds,
          shipperId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);

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
    { parPage, page, searchValue, sellerId, orderStatus },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/order/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&parPage=${parPage}&orderStatus=${orderStatus}`,
        { withCredentials: true }
      );
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
export const add_shipping_info = createAsyncThunk(
  "orders/add_shipping_info",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post(
        "/shipping/add-shipping-info",
        info
      );
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_shipping_info = createAsyncThunk(
  "orders/update_shipping_info",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        "/shipping/update-shipping-info",
        info
      );
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_order_status_update = createAsyncThunk(
  "orders/seller_order_status_update",
  async ({ orderId, orderStatus }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `order/seller/order-status/update/${orderId}`,
        { orderStatus },
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const check_order_pre_payment = createAsyncThunk(
  "orders/check_order_pre_payment",
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/order/check-order/${orderId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancel_order = createAsyncThunk(
  "orders/cancel_order",
  async ({ orderId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `/order/handle-cancel/${orderId}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const received_order = createAsyncThunk(
  "orders/received_order",
  async ({ orderId }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `/order/handle-received/${orderId}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const accept_orders = createAsyncThunk(
  "orders/accept_orders",
  async ({ orderIds }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `/order/handle-accept`,
        { orderIds },
        {
          withCredentials: true,
        }
      );
      console.log(data);
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
        state.totalOrder = payload.data.totalOrders;
        console.log(state.totalOrder);
      })
      .addCase(get_seller_order.fulfilled, (state, { payload }) => {
        state.shopOrder = payload.data;
      })

      .addCase(seller_order_status_update.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(seller_order_status_update.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(hand_over_orders_to_shipper.fulfilled, (state, { payload }) => {
        const { data } = payload;
        data.forEach((updatedOrder) => {
          const index = state.shopOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );

          if (
            index !== -1 &&
            state.shopOrders[index].orderStatus !== updatedOrder.orderStatus
          ) {
            state.shopOrders[index] = {
              ...state.shopOrders[index],
              orderStatus: updatedOrder.orderStatus,
            };
          }
        });

        state.successMessage = payload.message;
        console.log(payload.message);
      })
      .addCase(hand_over_orders_to_shipper.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })

      .addCase(add_shipping_info.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })

      .addCase(update_shipping_info.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(check_order_pre_payment.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.successMessage = payload.message;
      })
      .addCase(check_order_pre_payment.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(cancel_order.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(cancel_order.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      })
      .addCase(accept_orders.fulfilled, (state, { payload }) => {
        const { processedOrders } = payload.data;

        // Lặp qua các đơn hàng đã xử lý
        processedOrders.forEach((updatedOrder) => {
          const index = state.shopOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );

          // Nếu tìm thấy đơn hàng và trạng thái thay đổi
          if (
            index !== -1 &&
            state.shopOrders[index].orderStatus !== updatedOrder.orderStatus
          ) {
            // Cập nhật đơn hàng với trạng thái mới
            state.shopOrders[index] = {
              ...state.shopOrders[index],
              orderStatus: updatedOrder.orderStatus,
            };
          }
        });

        state.successMessage = payload.message; // Hiển thị thông báo thành công
      })
      .addCase(accept_orders.rejected, (state, { payload }) => {
        state.errorMessage = "Một số orders không hợp lệ";
      })
      .addCase(received_order.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(received_order.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
      });
  },
});
export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
