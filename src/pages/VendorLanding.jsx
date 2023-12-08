import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet, initializeUser } from "store/user.slice";
import { useNavigate } from "react-router-dom";

function VendorLanding() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { walletAddress, isConnected, storeId } = user;
  console.log(user);
  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const handleConnectWallet = () => {
    dispatch(connectWallet());
  };

  const navigate = useNavigate();

  if (isConnected && !!storeId) {
    navigate(`/store/${storeId}`);
  }

  // @TODO: Redirect to personal store if user is connected and has a storeId

  return (
    <div className="container">
      {!isConnected && (
        <>
          <h1>Launch my online retail store on web3 today</h1>
          <button onClick={handleConnectWallet} className="green-btn">
            Connect MetaMask
          </button>
        </>
      )}
      {isConnected && (
        <div>
          <h1>Launch my online retail store on web3 today</h1>
          <p>
            Connected Wallet Address:{" "}
            <span className="text-green">{walletAddress}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default VendorLanding;
