import { Button, Image } from "antd";
import React, { useEffect } from "react";
import styles from "styles/pages/Login.module.scss";
import fulllogo from "assets/images/logo/full-logo.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsConnected,
  setStoreId,
  setUserType,
  setWalletAddress,
} from "store/user.slice";
import { useNavigate } from "react-router-dom";
import { getVendorByAddress } from "services/vendorfactory.service";
import Web3 from "web3";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletAddress, isConnected, storeId } = useSelector(
    (state) => state.user
  );
  console.log({ walletAddress, isConnected, storeId });
  useEffect(() => {
    if (isConnected) {
      if (!storeId) {
        navigate(`/create-store`);
      } else {
        navigate(`/stores/${storeId}`);
      }
    }
  }, [walletAddress, isConnected, storeId]);

  const handleSafeLogin = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();

        const userData = await getVendorByAddress(accounts[0]);
        console.log({ userData });
        // Dispatch actions to update the Redux store
        dispatch(setWalletAddress(userData.vendorWalletAddress));
        dispatch(setIsConnected(true));
        dispatch(setUserType(userData?.userType ?? "vendor"));
        dispatch(setStoreId(userData.vendorAddress));

        // Additional logic if required
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    async function connectWalletAndGetUserData() {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();

          const userData = await getVendorByAddress(accounts[0]);
          console.log({ userData });
          // Dispatch actions to update the Redux store
          dispatch(setWalletAddress(userData.vendorWalletAddress));
          dispatch(setIsConnected(true));
          dispatch(setUserType(userData?.userType ?? "vendor"));
          dispatch(setStoreId(userData.vendorAddress));
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      }
    }

    connectWalletAndGetUserData();
  }, [dispatch]); // Add `dispatch` to the dependency array

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginPageContent}>
        <Image
          src={fulllogo}
          preview={false}
          className={styles.loginPageLogo}
        />
        <h3 className={styles.loginPageTitle}>
          Launch my online retail store on web3 today
        </h3>
        <Button
          onClick={handleSafeLogin}
          disabled={isConnected}
          className={styles.loginButton}
        >
          {isConnected ? "Connected" : "Login with safe"}
        </Button>
        <div className={styles.privacyText}>
          By logging in, You agree to our Terms of Service and our Privacy
          Policy.
        </div>
      </div>
    </div>
  );
};

export default Login;
