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
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { checkVendor } from "services/vendorfactory.service";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isConnected, storeId, userType } = useSelector((state) => state.user);

  useEffect(() => {
    if (isConnected && userType === "vendor") {
      navigate(`/vendor/${storeId}`);
    }
  }, [isConnected, navigate, storeId, userType]);

  const handleSafeLogin = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();

      const userData = await checkVendor(accounts[0]);

      if (!userData) {
        dispatch(setIsConnected(true));
        dispatch(setWalletAddress(accounts[0]));
        dispatch(setUserType("user"));
        navigate("/create-store");
        return;
      }
      // Dispatch actions to update the Redux store
      dispatch(setWalletAddress(userData.vendorWalletAddress));
      dispatch(setIsConnected(true));
      dispatch(setUserType(userData?.userType ?? "vendor"));
      dispatch(setStoreId(userData.vendorAddress));
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    async function connectWalletAndGetUserData() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();

        const userData = await checkVendor(accounts[0]);
        if (!userData && !isConnected) {
          dispatch(setIsConnected(true));
          dispatch(setWalletAddress(accounts[0]));
          dispatch(setUserType("user"));
          navigate("/create-store");
          return;
        }
        // Dispatch actions to update the Redux store
        dispatch(setWalletAddress(userData.vendorWalletAddress));
        dispatch(setIsConnected(true));
        dispatch(setUserType(userData?.userType ?? "vendor"));
        dispatch(setStoreId(userData.vendorAddress));
      } else {
        console.error("MetaMask is not installed");
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
