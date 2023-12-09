import React, { useEffect } from "react";
import Header from "./header/Header";
import styles from "styles/components/DashboardLayout.module.scss";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./header/Sidebar";
import { useDispatch } from "react-redux";
import {
  setIsConnected,
  setStoreId,
  setUserType,
  setWalletAddress,
} from "store/user.slice";
import Web3 from "web3";
import { checkVendor } from "services/vendorfactory.service";

const DashboardLayout = ({ children, hideSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    async function connectWalletAndGetUserData() {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();

          const userData = await checkVendor(accounts[0]);
          console.log({ userData });
          if (
            userData &&
            userData.vendorAddress &&
            userData.vendorWalletAddress
          ) {
            dispatch(setWalletAddress(userData.vendorWalletAddress));
            dispatch(setIsConnected(true));
            dispatch(setUserType("vendor"));
            dispatch(setStoreId(userData.vendorAddress));

            if (!location.pathname.includes("/vendor")) {
              navigate(`/vendor/${userData.vendorAddress}`);
            }
          } else {
            dispatch(setIsConnected(true));
            dispatch(setWalletAddress(accounts[0]));
            dispatch(setUserType("user"));
            if (
              location.pathname.includes("/vendor") &&
              user.userType === "user"
            ) {
              navigate(`/stores`);
            }
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

    // Event listener for account changes
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      } else {
        connectWalletAndGetUserData(); // Re-run your logic when the account changes
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Clean up the event listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [dispatch, navigate]); // Remove `window.ethereum` from dependencies to avoid re-running on each render

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
