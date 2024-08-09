import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/home/get-categories");
      console.log(data.data);
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);
export const get_products = createAsyncThunk(
  "product/get_products",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/home/get-products");
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);

export const price_range_product = createAsyncThunk(
  "product/price_range_product",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        "/home/price-range-latest-product"
      );
      console.log(data.data);
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);

export const query_products = createAsyncThunk(
  "product/query_products",
  async (query, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/home/query-products?category=${query.category}&rating=${
          query.rating
        }&lowPrice=${query.low}&highPrice=${query.high}&sortPrice=${
          query.sortPrice
        }&pageNumber=${query.pageNumber}&searchValue=${
          query.searchValue ? query.searchValue : ""
        } `
      );
      //  console.log(data)
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);
// End Method

export const product_details = createAsyncThunk(
  "product/product_details",
  async (slug, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/home/product-details/${slug}`);
      console.log(data);
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);
// End Method

export const customer_review = createAsyncThunk(
  "review/customer_review",
  async (info, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post(
        "/home/customer/submit-review",
        info
      );
      //  console.log(data)
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.error.message);
    }
  }
);
// End Method

export const get_reviews = createAsyncThunk(
  "review/get_reviews",
  async ({ productId, pageNumber }, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      //  console.log(data)
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);
// End Method

export const get_banners = createAsyncThunk(
  "banner/get_banners",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(`/banners`);
      //  console.log(data)
      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);
// End Method

export const homeReducer = createSlice({
  name: "home",
  initialState: {
    categories: [],
    products: [],
    totalProduct: 0,
    parPage: 3,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
      low: 0,
      high: 40000000,
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    errorMessage: "",
    successMessage: "",
    totalReview: 0,
    rating_review: [],
    reviews: [],
    banners: [],
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_category.fulfilled, (state, { payload }) => {
        state.categories = payload;
      })
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.products = payload.data.products;
        console.log(payload);
        state.latest_product = payload.data.latestProduct;
        state.topRated_product = payload.data.topRateProduct;
        state.discount_product = payload.data.topDiscountProduct;
      })
      .addCase(price_range_product.fulfilled, (state, { payload }) => {
        state.latest_product = payload.latestProduct;
        state.priceRange = payload.priceRange;
      })
      .addCase(query_products.fulfilled, (state, { payload }) => {
        state.products = payload.products;
        console.log(payload);
        state.totalProduct = payload.totalProduct;
        state.parPage = payload.parPage;
      })

      .addCase(product_details.fulfilled, (state, { payload }) => {
        state.product = payload.product;
        console.log(payload);
        state.relatedProducts = payload.relatedProducts;
        state.moreProducts = payload.moreProducts;
      })

      .addCase(customer_review.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })

      .addCase(get_reviews.fulfilled, (state, { payload }) => {
        console.log(payload);
        state.reviews = payload.reviews;
        state.totalReview = payload.totalReview;
        state.rating_review = payload.ratingReview;
      })

      .addCase(get_banners.fulfilled, (state, { payload }) => {
        state.banners = payload.banners;
      });
  },
});
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
