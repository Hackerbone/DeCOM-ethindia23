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
import { useNavigate, useLocation } from "react-router-dom";
import { checkVendor } from "services/vendorfactory.service";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isConnected, storeId, userType } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (isConnected && userType === "vendor") {
      navigate(`/vendor/${storeId}`);
    }
  }, [isConnected, navigate, storeId, userType]);

  const handleSafeLogin = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();

        const userData = await checkVendor(accounts[0]);
        if (
          userData &&
          userData?.vendorAddress &&
          userData?.vendorWalletAddress
        ) {
          dispatch(setWalletAddress(userData?.vendorWalletAddress));
          dispatch(setIsConnected(true));
          dispatch(setUserType("vendor"));
          dispatch(setStoreId(userData?.vendorAddress));
          navigate(`/vendor/${userData?.vendorAddress}`);
        } else {
          dispatch(setIsConnected(true));
          dispatch(setWalletAddress(accounts[0]));
          dispatch(setUserType("user"));
          navigate(`/create-store`);
          return;
        }
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

          const userData = await checkVendor(accounts[0]);
          if (
            userData &&
            userData?.vendorAddress &&
            userData?.vendorWalletAddress
          ) {
            dispatch(setWalletAddress(userData?.vendorWalletAddress));
            dispatch(setIsConnected(true));
            dispatch(setUserType("vendor"));
            dispatch(setStoreId(userData?.vendorAddress));
            navigate(`/vendor/${userData?.vendorAddress}`);
          } else {
            dispatch(setIsConnected(true));
            dispatch(setWalletAddress(accounts[0]));
            dispatch(setUserType("user"));
            return;
          }
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    }

    connectWalletAndGetUserData();
  }, [dispatch, isConnected, navigate]); // Add `dispatch` to the dependency array

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
          onClick={
            isConnected
              ? () => {
                  navigate(`/create-store`);
                }
              : handleSafeLogin
          }
          className={styles.loginButton}
        >
          {isConnected ? "Launch my Store" : "Connect Wallet"}
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
