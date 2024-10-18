import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";
import { jwtDecode } from "jwt-decode";
export const create_shipper = createAsyncThunk(
  "shipper/create_shipper",
  async (shipperInfo, thunkAPI) => {
    try {
      const res = await instanceApi.post("/shipper/register", shipperInfo);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const login_shipper = createAsyncThunk(
  "shipper/login_shipper",
  async (shipperInfo, thunkAPI) => {
    try {
      const res = await instanceApi.post("/shipper/login", shipperInfo);
      localStorage.setItem("accessToken", res.data.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_all_shippers = createAsyncThunk(
  "shipper/get_all_shippers",
  async ({ shopAddress }, thunkAPI) => {
    try {
      const { data } = await instanceApi.get(
        "/shipper?shopAddress=" + shopAddress
      );
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_all_orders = createAsyncThunk(
  "shipper/get_all_orders",
  async ({ shipperId, deliveryStatus, date }, thunkAPI) => {
    try {
      const dateParam = date ? `&date=${date}` : "";
      const { data } = await instanceApi.get(
        `/shipper/orders/${shipperId}?deliveryStatus=${deliveryStatus}${dateParam}`
      );
      console.log(data);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_info_order = createAsyncThunk(
  "shipper/get_info_order",
  async ({ orderId }, thunkAPI) => {
    console.log(orderId);
    try {
      const { data } = await instanceApi.get(
        "/shipper/orders/details/" + orderId
      );
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const update_delivery_status = createAsyncThunk(
  "shipper/update_delivery_status",
  async ({ orderId, status }, thunkAPI) => {
    console.log(status);
    try {
      const res = await instanceApi.put(
        `/shipper/update-delivery-status/${orderId}`,
        { status }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const get_shipper_dashboard = createAsyncThunk(
  "shipper/get_shipper_dashboard",
  async ({ shipperId, date }, thunkAPI) => {
    try {
      const { data } = await instanceApi.get(
        `/shipper/dashboard/${shipperId}?date=${date}`
      );
      console.log(data);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const jwtDecocde = (token) => {
  if (token) {
    return jwtDecode(token);
  } else {
    return "";
  }
};

const initialState = {
  loading: false,
  shippers: [],
  shipperInfo: jwtDecocde(localStorage.getItem("accessToken")),
  token: localStorage.getItem("accessToken"),
  errorMessage: "",
  successMessage: "",
  ordersAssigned: [],
  ordersCanceled: [],
  ordersDelivered: [],
  totalIncome: 0,
  ordersAssignedCount: 0,
  ordersCanceledCount: 0,
  ordersDeliveredCount: 0,
  orderInfo: "",
};

const shipperReducer = createSlice({
  name: "shipper",
  initialState,
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(create_shipper.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(create_shipper.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.successMessage = payload.message;
    });
    builder.addCase(create_shipper.rejected, (state, { payload }) => {
      state.loading = false;
      console.log(payload);
      state.errorMessage = payload.message;
    });

    builder.addCase(login_shipper.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login_shipper.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.successMessage = payload.message;
      console.log(payload);
      state.token = payload;
    });
    builder.addCase(login_shipper.rejected, (state, { payload }) => {
      state.loading = false;
      state.errorMessage = payload.message;
    });

    builder.addCase(get_all_shippers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(get_all_shippers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.shippers = payload;
    });
    builder.addCase(get_all_shippers.rejected, (state, { payload }) => {
      state.loading = false;
      state.errorMessage = payload.message;
    });

    builder.addCase(get_all_orders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(get_all_orders.fulfilled, (state, { payload, meta }) => {
      state.loading = false;
      const { deliveryStatus } = meta.arg;
      if (deliveryStatus === "assigned") {
        state.ordersAssigned = payload;
      } else if (deliveryStatus === "cancelled") {
        state.ordersCanceled = payload;
        console.log(state.ordersCanceled);
      } else if (deliveryStatus === "delivered") {
        state.ordersDelivered = payload;
      }
    });
    builder.addCase(get_all_orders.rejected, (state, { payload }) => {
      state.loading = false;
      state.errorMessage = payload.message;
    });

    builder.addCase(get_info_order.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(get_info_order.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orderInfo = payload;
      console.log(payload);
    });
    builder.addCase(update_delivery_status.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(update_delivery_status.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.successMessage = payload.message;
    });
    builder.addCase(update_delivery_status.rejected, (state, { payload }) => {
      state.loading = false;
      state.errorMessage = payload.message;
    });

    builder.addCase(get_shipper_dashboard.fulfilled, (state, { payload }) => {
      state.loading = true;
      console.log(payload);
      state.totalIncome = payload.totalIncome;
      state.ordersAssignedCount = payload.total;
      state.ordersCanceledCount = payload.cancelled;
      state.ordersDeliveredCount = payload.success;
    });
  },
});

export const { messageClear } = shipperReducer.actions;
export default shipperReducer.reducer;
