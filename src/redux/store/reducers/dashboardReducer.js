import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_admin_dashboard_data = createAsyncThunk(
  "dashboard/get_admin_dashboard_data",
  async ({ date }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/dashboard/admin?date=${date}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
export const get_daily_platform_wallet_stats = createAsyncThunk(
  "dashboard/get_daily_platform_wallet_stats",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/dashboard/get-wallet-stats`, {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_products_count_by_category = createAsyncThunk(
  "dashboard/get_products_count_by_category",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        "/dashboard/get-product-count-by-category",
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_seller_stast_by_admin = createAsyncThunk(
  "dashboard/get_seller_stast_by_admin",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        "/dashboard/get-seller-stast-by-admin",
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_top_seller_dashboard = createAsyncThunk(
  "dashboard/get_top_seller_dashboard",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        "/dashboard/get-top-seller-dashboard",
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState: {
    totalSale: 0,
    totalOrder: 0,
    totalProduct: 0,
    totalPendingOrder: 0,
    totalSeller: 0,
    recentOrders: [],
    dailyStats: [],
    dailyProductsSold: 0,
    dailyOrders: 0,
    completedOrders: 0,
    statsCategory: [],
    sellerStats: [],
    sellerTop: [],
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
        state.dailyProductsSold = payload.dailyProductsSold;
        state.dailyOrders = payload.dailyOrders;
        state.completedOrders = payload.completedOrders;
        state.recentOrders = payload.recentOrders;
      })
      .addCase(
        get_daily_platform_wallet_stats.fulfilled,
        (state, { payload }) => {
          state.dailyStats = payload;
        }
      )
      .addCase(
        get_products_count_by_category.fulfilled,
        (state, { payload }) => {
          state.statsCategory = payload;
        }
      )
      .addCase(get_seller_stast_by_admin.fulfilled, (state, { payload }) => {
        state.sellerStats = payload.sellers;
      })
      .addCase(get_top_seller_dashboard.fulfilled, (state, { payload }) => {
        state.sellerTop = payload;
      });
  },
});
export const { messageClear } = dashboardReducer.actions;
export default dashboardReducer.reducer;
