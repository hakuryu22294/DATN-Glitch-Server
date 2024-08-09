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
  },
});

export const { messageClear } = shipperReducer.actions;
export default shipperReducer.reducer;
