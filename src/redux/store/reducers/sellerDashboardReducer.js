import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_seller_dashboard_data = createAsyncThunk(
  "dashboard/get_seller_dashboard_data",
  async ({ date }, { rejectWithValue, fulfillWithValue }) => {
    console.log(date);
    try {
      const { data } = await instanceApi.get(`/dashboard/seller?date=${date}`, {
        withCredentials: true,
      });
      console.log(data.data);
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
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_top_products = createAsyncThunk(
  "dashboard/get_top_products",
  async ({ sellerId }, { rejectWithValue, fulfillWithValue }) => {
    console.log(sellerId);
    try {
      const { data } = await instanceApi.get(`/dashboard/get-top/${sellerId}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const sellerDashboardReducer = createSlice({
  name: "sellerDashboard",
  initialState: {
    totalSale: 0,
    totalOrder: 0,
    totalPendingOrder: 0,
    totalSold: 0,
    recentOrder: [],
    dailyStats: [],
    totalSalePerDay: 0,
    totalOrderPerDay: 0,
    totalPendingOrderPerDay: 0,
    totalSoldPerDay: 0,
    topProducts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(get_seller_dashboard_data.fulfilled, (state, { payload }) => {
        state.totalSalePerDay = payload.totalSale;
        state.totalOrderPerDay = payload.totalOrder;
        state.totalPendingOrderPerDay = payload.totalPendingOrder;
        state.totalSoldPerDay = payload.totalSoldProducts;
        state.recentOrder = payload.recentsOrders;
      })
      .addCase(get_daily_stats.fulfilled, (state, { payload }) => {
        state.dailyStats = payload;
      })
      .addCase(get_top_products.fulfilled, (state, { payload }) => {
        state.topProducts = payload;
      });
  },
});

export default sellerDashboardReducer.reducer;
