import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet, initializeUser } from "store/user.slice";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { createVendorContract } from "services/vendorfactory.service";

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

  const isValidUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  const createVendor = (values) => {
    const { name, logo } = values;
    if (!name || !logo) {
      console.log("empty");
      return;
    }
    if (!isValidUrl(logo)) {
      console.log("invalid url");
      return;
    }
    // call the create vendor
    createVendorContract({ name, logo })
      .then((res) => {
        console.log("New vendor contract address", res);
        message.success("Vendor created successfully");
        navigate(`/stores/${res}`);
      })
      .catch((err) => {
        console.log(err);
        message.error("Vendor creation failed");
      });
  };

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
          <h1>Become a Vendor today</h1>
          <Form layout="vertical" onFinish={createVendor}>
            <Form.Item label="Store Name" name="name">
              <Input placeholder="Enter your store name" />
            </Form.Item>
            <Form.Item label="Logo URL" name="logo">
              <Input placeholder="Your Logo URL" />
            </Form.Item>
            <Button className="green-btn" htmlType="submit">
              Start Selling <span>🚀</span>
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default VendorLanding;
