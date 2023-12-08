import React, { useEffect } from "react";
import Header from "./header/Header";
import styles from "styles/components/DashboardLayout.module.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./header/Sidebar";
import { useDispatch } from "react-redux";
import {
  setIsConnected,
  setStoreId,
  setUserType,
  setWalletAddress,
} from "store/user.slice";
import Web3 from "web3";
import { getVendorByAddress } from "services/vendorfactory.service";

const DashboardLayout = ({ children, hideSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.isConnected) {
      navigate("/auth");
    }
  }, [user]);

  useEffect(() => {
    async function connectWalletAndGetUserData() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();

        const userData = await getVendorByAddress(accounts[0]);
        console.log({ userData });

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
    }

    connectWalletAndGetUserData();
  }, [dispatch, window.ethereum]); // Add `dispatch` to the dependency array

  return (
    <div
      className={`${styles.dashboardLayoutContainer} ${
        hideSidebar ? styles.dashboardLayoutContainerNoSidebar : ""
      }`}
    >
      {!hideSidebar && <Sidebar />}
      <div className={styles.dashboardLayout}>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
