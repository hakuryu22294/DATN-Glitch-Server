import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { jwtDecode } from "jwt-decode";
import instanceApi from "../../../configs/api.config";

export const admin_login = createAsyncThunk(
  "auth/admin_login",
  async ({ info }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post("/manager/admin/login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const shipper_login = createAsyncThunk(
  "auth/shipper_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post("/shipper/login", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post("/customer/login", info, {
        withCredentials: true,
      });
      const shop = await instanceApi.get("/customer/get-shop-info", {
        withCredentials: true,
      });
      if (shop.data.data) {
        localStorage.setItem("shopInfo", JSON.stringify(shop.data.data));
      }

      localStorage.setItem("accessToken", data.data);

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.post("/customer/register", info, {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const reset_token = createAsyncThunk(
  "auth/reset_token",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/customer/reset-token", {
        withCredentials: true,
      });
      localStorage.setItem("accessToken", data.data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const get_shop_info = createAsyncThunk(
  "auth/get_shop_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/customer/get-shop-info", {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/manager/profile-info", {
        withCredentials: true,
      });
      return fulfillWithValue(data.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_image_upload = createAsyncThunk(
  "auth/profile_image_upload",
  async ({ image, sellerId }, { rejectWithValue, fulfillWithValue }) => {
    console.log(image);
    try {
      const { data } = await instanceApi.post(
        "/manager/profile-image-upload/" + sellerId,
        image,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const seller_register = createAsyncThunk(
  "auth/seller/register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(info);
      const { data } = await instanceApi.post(
        "/manager/seller/register",
        info,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("shopInfo", JSON.stringify(data.data));
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const profile_info_add = createAsyncThunk(
  "auth/profile_info_add",
  async (
    { phoneNumber, address, sellerId },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await instanceApi.post(
        "/manager/profile-info-add",
        { phoneNumber, address, sellerId },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

const decodeToken = (token) => {
  if (token) {
    const userInfo = jwtDecode(token);
    return userInfo;
  } else {
    return "";
  }
};

// end Method

export const logout = createAsyncThunk(
  "auth/logout",
  async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await instanceApi.get("/customer/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("shopInfo");
      if (role === "admin") {
        navigate("/admin/login");
      } else if (role === "shipper" || role === "seller") {
        navigate("/login");
      }
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

// end Method

export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: decodeToken(localStorage.getItem("accessToken")),
    token: localStorage.getItem("accessToken"),
    shopInfo: "",
    userFull: {},
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    getUserInfo: (state) => {
      state.userInfo = decodeToken(state.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(admin_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(admin_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;

        state.token = payload.data;
      })
      .addCase(register.pending, (state) => {
        state.loader = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.data;
        state.userInfo = decodeToken(payload.data);
      })
      .addCase(login.pending, (state) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.data;
        state.userInfo = decodeToken(payload.data);
      })
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
      })
      .addCase(seller_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.shopInfo = payload.data;
      })
      .addCase(shipper_login.pending, (state) => {
        state.loader = true;
      })
      .addCase(shipper_login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload;
      })
      .addCase(shipper_login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.data;
        state.userInfo = decodeToken(payload.data);
      })
      .addCase(profile_image_upload.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.shopInfo = payload.data;
        console.log(payload);
        state.successMessage = payload.message;
      })

      .addCase(profile_info_add.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_info_add.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.shopInfo = payload.data;
        state.successMessage = payload.message;
      })
      .addCase(reset_token.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.data;
      })

      .addCase(get_shop_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.shopInfo = payload;
      })
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userFull = payload;
      });
  },
});
export const { messageClear, getUserInfo } = authReducer.actions;
export default authReducer.reducer;
