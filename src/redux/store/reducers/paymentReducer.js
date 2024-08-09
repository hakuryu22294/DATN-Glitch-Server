import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const createPaymentUrl = createAsyncThunk(
  "payment/createPaymentUrl",
  async ({ amount, orderId, returnUrl }, { rejectWithValue }) => {
    try {
      const response = await instanceApi.post("/payment/create-payment", {
        amount,
        orderId,
        returnUrl,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const saveTransaction = createAsyncThunk(
  "payment/saveTransaction",
  async (
    { orderId, amount, responseCode, paymentStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await instanceApi.post("/payment/save", {
        orderId,
        amount,
        responseCode,
        paymentStatus,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentUrl: null,
    transaction: null,
    status: "idle",
    error: null,
  },
  reducers: {
    messageClear: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentUrl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPaymentUrl.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.paymentUrl = action.payload;
      })
      .addCase(createPaymentUrl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveTransaction.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transaction = action.payload;
      })
      .addCase(saveTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { messageClear } = paymentSlice.actions;

export default paymentSlice.reducer;
