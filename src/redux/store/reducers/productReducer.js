import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const add_product = createAsyncThunk(
  "product/add_product",
  async (product, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post("/product", product, {
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response);
    }
  }
);

// End Method

export const get_products = createAsyncThunk(
  "product/get_products",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.get(
        `/product?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data.message);
    }
  }
);

// End Method

export const get_product = createAsyncThunk(
  "product/get_product",
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/product/${productId}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data.message);
    }
  }
);

// End Method

export const update_product = createAsyncThunk(
  "product/update_product",
  async (product, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.patch("/product/update", product, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const get_products_shop = createAsyncThunk(
  "product/get_products_shop",
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/product/shop/${sellerId}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response);
    }
  }
);

// End Method

export const product_image_update = createAsyncThunk(
  "product/product_image_update",
  async (
    { oldImage, newImage, productId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("oldImage", oldImage);
      formData.append("newImage", newImage);
      formData.append("productId", productId);
      const { data } = await instanceApi.post(
        "/product-image-update",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response);
    }
  }
);

// End Method

export const productReducer = createSlice({
  name: "product",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    products: [],
    product: {},
    shop: "",
    totalProduct: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_product.rejected, (state, { payload }) => {
        state.loader = false;
        console.log(payload);
        state.errorMessage = payload.data.message;
      })
      .addCase(add_product.fulfilled, (state, { payload }) => {
        state.loader = false;

        state.successMessage = payload.message;
      })

      .addCase(get_products.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.totalProduct = payload.data.total;
        state.products = payload.data.products;
      })
      .addCase(get_product.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.product = payload.data;
      })

      .addCase(update_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_product.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.error;
      })
      .addCase(update_product.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.product = payload.product;
        state.successMessage = payload.message;
      })

      .addCase(product_image_update.fulfilled, (state, { payload }) => {
        state.product = payload.product;
        state.successMessage = payload.message;
      })

      .addCase(get_products_shop.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.shop = payload.data.shop;
        state.products = payload.data.products;
      });
  },
});
export const { messageClear } = productReducer.actions;
export default productReducer.reducer;
