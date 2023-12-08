import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";

const initialState = {
  walletAddress: localStorage.getItem("walletAddress") || "",
  isConnected: !!localStorage.getItem("walletAddress"),
  storeId: "",
  userType: "",
  contractAddress: "",
};

export const initializeUser = createAsyncThunk(
  "user/initializeUser",
  async (_, { dispatch }) => {
    const walletAddress = localStorage.getItem("walletAddress");
    if (walletAddress) {
      dispatch(setWalletAddress(walletAddress));
      dispatch(setIsConnected(true));
    }
  }
);

export const connectWallet = createAsyncThunk(
  "user/connectWallet",
  async (_, { dispatch }) => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        localStorage.setItem("walletAddress", accounts[0]);
        dispatch(setWalletAddress(accounts[0]));
        dispatch(setIsConnected(true));
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  }
);

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
    setContractAddress(state, action) {
      state.contractAddress = action.payload;
    },
    setStoreId(state, action) {
      state.storeId = action.payload;
    },
  },
});

export const {
  setWalletAddress,
  setIsConnected,
  setUserType,
  setContractAddress,
  setStoreId,
} = userSlice.actions;

export default userSlice.reducer;
