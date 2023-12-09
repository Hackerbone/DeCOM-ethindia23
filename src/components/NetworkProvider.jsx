import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ethers } from "ethers";
import { setNetwork } from "store/user.slice";
const NetworkProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { network } = useSelector((state) => state.user);

  console.log("+++++++++++++++Current++++++++++++++++");
  console.log(network);
  console.log("+++++++++++++++network++++++++++++++++");

  const checkNetwork = useCallback(async () => {
    try {
      if (window.ethereum) {
        // Initialize ethers provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get network information
        const network = await provider.getNetwork();

        // Dispatch network name to Redux
        dispatch(setNetwork(network.name ?? "ganache"));
      }
    } catch (error) {
      console.error("Error getting network: ", error);
      // Optionally handle error or dispatch error state
    }
  }, [dispatch]);

  useEffect(() => {
    checkNetwork();

    // Listen for network changes
    window.ethereum?.on("chainChanged", checkNetwork);

    // Listen for account changes
    window.ethereum?.on("accountsChanged", checkNetwork);

    // Clean up listeners when component unmounts
    return () => {
      window.ethereum?.removeListener("chainChanged", checkNetwork);
      window.ethereum?.removeListener("accountsChanged", checkNetwork);
    };
  }, [checkNetwork]);

  return <>{children}</>;
};

export default NetworkProvider;
