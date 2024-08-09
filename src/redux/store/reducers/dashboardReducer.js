import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_admin_dashboard_data = createAsyncThunk(
  "dashboard/get_admin_dashboard_data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/dashboard/admin", {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_seller_dashboard_data = createAsyncThunk(
  "dashboard/get_seller_dashboard_data",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/dashboard/seller", {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_daily_stats = createAsyncThunk(
  "dashboard/get_daily_stats",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/dashboard/get-stats", {
        withCredentials: true,
      });
      console.log(data.data);
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
// End method

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: {
    totalSale: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalPendingOrder: 0,
    totalSeller: 0,
    recentOrder: [],
    recentMessage: [],
    dailyStats: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_admin_dashboard_data.fulfilled, (state, { payload }) => {
        state.totalSale = payload.totalSale;
        console.log(payload);
        state.totalOrder = payload.totalOrder;
        state.totalProduct = payload.totalProduct;
        state.totalSeller = payload.totalSeller;
        state.recentOrder = payload.recentOrders;
        state.recentMessage = payload.messages;
      })
      .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
        state.totalSale = payload.totalSale;
        state.totalOrder = payload.totalOrder;
        state.totalProduct = payload.totalProduct;
        state.totalPendingOrder = payload.totalPendingOrder;
        state.recentOrder = payload.recentOrders;
        state.recentMessage = payload.messages;
      })
      .addCase(get_daily_stats.fulfilled, (state, { payload }) => {
        state.dailyStats = payload;
      });
  },
});
export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
