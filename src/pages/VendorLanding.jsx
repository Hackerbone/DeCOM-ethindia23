import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { createVendorContract } from "services/vendorfactory.service";

function VendorLanding() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { walletAddress, isConnected, storeId } = user;
  console.log(user);

  const navigate = useNavigate();

  if (isConnected && !!storeId) {
    navigate(`/vendor/${storeId}`);
  }

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

  if (!isConnected) {
    navigate(`/auth`);
  }

  return (
    <div className="container">
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

export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};
