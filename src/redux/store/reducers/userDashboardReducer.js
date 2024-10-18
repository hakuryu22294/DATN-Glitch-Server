import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_dashboard_index_data = createAsyncThunk(
  "dashboard/get_dashboard_index_data",
  async (userId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/order/get-dashboard-data/${userId}`
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const userDashboardReducer = createSlice({
  name: "userDashboard",
  initialState: {
    recentOrders: [],
    errorMessage: "",
    successMessage: "",
    totalOrder: 0,
    pendingOrder: 0,
    cancelledOrder: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      get_dashboard_index_data.fulfilled,
      (state, { payload }) => {
        console.log(payload);
        state.totalOrder = payload.data.totalOrder;
        state.pendingOrder = payload.data.pendingOrder;
        state.cancelledOrder = payload.data.cancelledOrder;
        state.recentOrders = payload.data.recentOrders;
      }
    );
  },
});
export const { messageClear } = userDashboardReducer.actions;
export default userDashboardReducer.reducer;
