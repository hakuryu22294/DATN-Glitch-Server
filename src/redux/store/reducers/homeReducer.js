import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instanceApi from "../../../configs/api.config";

export const get_category = createAsyncThunk(
  "product/get_category",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/home/get-categories");
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
      console.log(data);
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
  async (
    { review, rating, productId, orderId, customerId },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      console.log({ review, rating, productId, orderId, customerId });
      const { data } = await instanceApi.post("/home/customer/submit-review", {
        review,
        rating,
        productId,
        orderId,
        customerId,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const get_reviews = createAsyncThunk(
  "review/get_reviews",
  async ({ productId, pageNumber }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`
      );
      //  console.log(data)
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.respone.data.message);
    }
  }
);
export const get_featured_products = createAsyncThunk(
  "home/get_featured_products",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        "/product/home/feartured-products"
      );
      console.log(data.data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
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

export const get_shop_data = createAsyncThunk(
  "home/get_shop_data",
  async ({ sellerId }, { fulfillWithValue }) => {
    console.log(sellerId);
    try {
      const { data } = await instanceApi.get(
        `/home/shop-page/get-data/${sellerId}`
      );

      return fulfillWithValue(data.data);
    } catch (error) {
      console.log(error.respone.data.message);
    }
  }
);
export const get_customer_wallet = createAsyncThunk(
  "home/get_customer_wallet",
  async ({ customerId }, { fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get(
        `/home/customer-wallet/${customerId}`
      );
      console.log(data);
      return fulfillWithValue(data);
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
    topCategoriesWithProducts: [],
    shopData: {},
    loader: false,
    customerWallet: 0,
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
      .addCase(get_products.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_products.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.products = payload.data.products;
        state.latest_product = payload.data.latestProduct;
        state.topRated_product = payload.data.topRateProduct;
        state.discount_product = payload.data.topDiscountProduct;
      })
      .addCase(price_range_product.fulfilled, (state, { payload }) => {
        state.latest_product = payload.latestProduct;
        state.priceRange = payload.priceRange;
      })
      .addCase(query_products.fulfilled, (state, { payload }) => {
        state.products = payload.products.products;
        state.totalProduct = payload.totalProduct;
        state.parPage = payload.parPage;
      })
      .addCase(product_details.pending, (state) => {
        state.loader = true;
      })
      .addCase(product_details.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.product = payload.product;
        state.relatedProducts = payload.relatedProducts;
        state.moreProducts = payload.moreProducts;
      })

      .addCase(customer_review.fulfilled, (state, { payload }) => {
        state.successMessage = payload.message;
      })
      .addCase(customer_review.rejected, (state, { payload }) => {
        state.errorMessage = payload.message;
        console.log(payload.message);
      })

      .addCase(get_reviews.fulfilled, (state, { payload }) => {
        state.reviews = payload.reviews;
        state.totalReview = payload.totalReview;
        state.rating_review = payload.ratingReview;
      })

      .addCase(get_banners.fulfilled, (state, { payload }) => {
        state.banners = payload.banners;
      })
      .addCase(get_featured_products.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_featured_products.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.topCategoriesWithProducts = payload.data;
      })

      .addCase(get_shop_data.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_shop_data.fulfilled, (state, { payload }) => {
        state.loader = false;

        state.shopData = payload;
      })
      .addCase(get_customer_wallet.fulfilled, (state, { payload }) => {
        state.customerWallet = payload.data.totalAmount;
      });
  },
});
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
