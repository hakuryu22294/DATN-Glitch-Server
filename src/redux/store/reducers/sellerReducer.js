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
  async ({ sellerId, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.put(
        `/seller/update/${sellerId}`,
        { sellerId, status },
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

export const get_pending_sellers = createAsyncThunk(
  "seller/get_pending_sellers",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/seller/pending/get-pending-seller?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );

      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const add_sub_category = createAsyncThunk(
  "seller/add_sub_category",
  async ({ sellerId, subCategory }, { rejectWithValue, fulfillWithValue }) => {
    console.log(sellerId, subCategory);
    try {
      const { data } = await instanceApi.post(
        "/seller/add-subcategory",
        { sellerId, subCategory },
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
        state.seller = payload;
      })
      .addCase(seller_status_update.fulfilled, (state, { payload }) => {
        state.seller = payload.seller;
        state.successMessage = payload.message;
      })
      .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.sellers;
        state.totalSeller = payload.totalSeller;
      })
      .addCase(get_pending_sellers.fulfilled, (state, { payload }) => {
        state.sellers = payload.seller;
        console.log(payload);
        state.totalSeller = payload.totalSeller;
      })
      .addCase(add_sub_category.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      });

    // .addCase(register.fulfilled, (state, { payload }) => {
  },
});
export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;
