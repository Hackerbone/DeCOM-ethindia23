import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser } from "store/user.slice";
import { useParams } from "react-router-dom";
import {
  getSpecVendorProducts,
  listAllVendors,
  placeOrder,
} from "services/vendor.service";
import { Card, Input, Modal, Form, message, Button } from "antd";
import { FaEthereum } from "react-icons/fa";
import { isValidUrl } from "./VendorLanding";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertToEthers } from "utils/convert";

const { Meta } = Card;
function SpecStore() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [vendorData, setVendorData] = useState({}); // [name, description, picture
  const { isConnected } = useSelector((state) => state.user);
  const { storeAddress } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(false);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const { data: specStoreProducts, isLoading } = useQuery({
    queryKey: ["specStoreProducts"],
    queryFn: () => getSpecVendorProducts(storeAddress),
    enabled: isConnected,
  });

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (res) => {
      console.log("New product added", res);
      message.success("Product added successfully");
    },
    onError: (err) => {
      console.log(err);
      message.error("Product addition failed");
    },
  });

  const placeOrderFn = async (values) => {
    const { shippingAddress } = values;
    if (!shippingAddress) {
      message.error("Please fill all the fields");
      return;
    }

    console.log(shippingAddress);

    if (!selectedProduct || !selectedProduct.id) {
      message.error("Invalid product");
      return;
    }

    if (!storeAddress) {
      message.error("Invalid store address");
      return;
    }

    await placeOrderMutation.mutateAsync({
      vendorAddress: storeAddress,
      id: selectedProduct.id,
      shippingAddress,
      productPrice: selectedProduct.price,
    });

    setSelectedProduct(null);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="store-container">
      <div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "0.6rem" }}>
          Welcome back, {vendorData?.name}
        </h1>
        <Input placeholder="Search for stores" style={{ width: "24rem" }} />
      </div>

      <div
        style={{
          margin: "1rem 0",
          marginTop: "2rem",
          fontWeight: "400",
        }}
      >
        {products.length} stores found
      </div>
      <div className="store-grid">
        {specStoreProducts?.map((item, idx) => {
          return (
            <Card
              key={idx}
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src={item.picture} />}
              onClick={() => {
                setSelectedProduct(item);
              }}
            >
              <Meta
                title={item.name}
                description={
                  <>
                    <div>
                      <FaEthereum size={10} />
                      ETH {convertToEthers(item.price)}
                    </div>
                    <div>{item.description}</div>
                  </>
                }
              />
            </Card>
          );
        })}
      </div>
      {console.log(selectedProduct)}
      {selectedProduct && (
        <Modal
          title={`Buy ${selectedProduct?.name} for ${convertToEthers(
            selectedProduct?.price
          )} ETH`}
          open={!!selectedProduct}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => <></>}
        >
          <img
            alt="Product"
            src={selectedProduct?.picture}
            style={{
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #e5e5e5",
            }}
          />

          <h3
            style={{
              color: "#000",
            }}
          >
            Enter your shipping address to place the order{" "}
          </h3>

          <Form layout="vertical" onFinish={placeOrderFn}>
            <Form.Item label="Shipping Address" name="shippingAddress">
              <Input.TextArea
                placeholder="Address"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            <Button
              className="green-btn"
              htmlType="submit"
              loading={placeOrderMutation.isLoading}
            >
              Buy Now for <FaEthereum size={10} />{" "}
              {selectedProduct && convertToEthers(selectedProduct.price)}
            </Button>
          </Form>
        </Modal>
      )}
    </div>
  );
}

export default SpecStore;
