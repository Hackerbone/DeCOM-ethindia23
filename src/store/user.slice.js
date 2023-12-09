import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletAddress: "",
  isConnected: false,
  userType: "",
  storeId: "",
  currentStore: {
    name: "",
    logo: "",
    storeId: "",
  },
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
      state = initialState;
    },
    setCurrentStore(state, action) {
      state.currentStore = action.payload;
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
  setCurrentStore,
} = userSlice.actions;

export default userSlice.reducer;
