import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_seller_request = createAsyncThunk(
  "seller/get_seller_request",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/seller?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      console.log(data);
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_seller = createAsyncThunk(
  "seller/get_seller",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/seller/${sellerId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const seller_status_update = createAsyncThunk(
  "seller/seller_status_update",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `/seller/update/${info.sellerId}`,
        info,
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// End Method

export const get_active_sellers = createAsyncThunk(
  "seller/get_active_sellers",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/seller?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_deactive_sellers = createAsyncThunk(
  "seller/get_deactive_sellers",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// End Method

// End Method

export const sellerReducer = createSlice({
  name: "seller",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    sellers: [],
    totalSeller: 0,
    seller: {},
  },
  reducers: {
    messageClear: (state) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(get_seller_request.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers;

        state.totalSeller = payload.totalSeller;
      })
      .addCase(get_seller.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.seller = payload;
      })
      .addCase(seller_status_update.fulfilled, (state, { payload }) => {
        state.seller = payload.seller;
        state.successMessage = payload.message;
      })
      .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers;
        console.log(payload);
        state.totalSeller = payload.totalSeller;
      })
      .addCase(get_deactive_sellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers;
        state.totalSeller = payload.data.totalSeller;
      });
  },
});
export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;
