import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletAddress: "",
  isConnected: false,
  userType: "",
  storeId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setWalletAddress(state, action) {
      state.walletAddress = action.payload;
    },
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    },
    setUserType(state, action) {
      state.userType = action.payload;
    },
    setStoreId(state, action) {
      state.storeId = action.payload;
    },
    logout(state) {
      localStorage.removeItem("user");
      Object.assign(state, initialState);
    },
  },
});

export const {
  setWalletAddress,
  setIsConnected,
  setUserType,
  setContractAddress,
  setStoreId,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
