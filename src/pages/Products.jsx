import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser } from "store/user.slice";
import { useParams } from "react-router-dom";
import {
  addProductToVendor,
  getSpecVendorProducts,
  listAllVendors,
} from "services/vendor.service";
import { Input, Table, Button, Modal, Form, message } from "antd";
import Web3 from "web3";
import { FaEthereum, FaPlus } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isValidUrl } from "./VendorLanding";
function SpecStore() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [vendorData, setVendorData] = useState({});
  const { isConnected } = useSelector((state) => state.user);
  const { storeAddress } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/1a2f1d6b0e5e4b0b8d0b2f8a2d8c4a6e"
    )
  ); // Initialize web3 with your Ethereum provider

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const { data: specVendorProducts, isLoading } = useQuery({
    queryKey: ["internalDashproducts"],
    queryFn: () => getSpecVendorProducts(storeAddress),
    enabled: isConnected,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const createProductMutation = useMutation({
    mutationFn: addProductToVendor,
    onSuccess: (res) => {
      console.log("New product added", res);
      message.success("Product added successfully");
    },
    onError: (err) => {
      console.log(err);
      message.error("Product addition failed");
    },
  });

  const addProduct = async (values) => {
    const { name, price, picture } = values;
    if (!name || !price || !picture) {
      message.error("Please fill all the fields");
      return;
    }

    if (!isValidUrl(picture)) {
      message.error("Invalid picture URL");
      return;
    }

    console.log(storeAddress, name, price, picture);

    await createProductMutation.mutateAsync({
      vendorAddress: storeAddress,
      name,
      price: web3.utils.toWei(price.toString(), "ether"),
      picture,
    });

    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Products",
      dataIndex: "picture",
      key: "picture",
      render: (text, record) => (
        <div
          className="flex"
          style={{
            gap: "1rem",
          }}
        >
          <img
            alt="Product"
            src={text}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "4px",
              objectFit: "cover",
            }}
          />
          <div style={{ fontWeight: "500", marginTop: "0.5rem" }}>
            {record.name}
          </div>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        <span>
          <FaEthereum size={10} />
          ETH {web3.utils.fromWei(text.toString(), "ether")}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="store-container">
      <div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "0.6rem" }}>Products</h1>
      </div>

      <div
        className="flex"
        style={{
          justifyContent: "space-between",
        }}
      >
        <Input placeholder="Search for stores" style={{ width: "24rem" }} />
        <Button className="green-btn" onClick={showModal}>
          Add Products <FaPlus size={10} />
        </Button>
      </div>

      <div style={{ margin: "1rem 0", marginTop: "2rem", fontWeight: "400" }}>
        {products.length} stores found
      </div>

      <Table
        dataSource={specVendorProducts}
        columns={columns}
        rowKey="id"
        bordered={false}
      />

      <Modal
        title={`Add new product to the ${vendorData.name} Store!`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => <></>}
      >
        <Form layout="vertical" onFinish={addProduct}>
          <Form.Item label="Product Name" name="name">
            <Input placeholder="Enter Product Name" />
          </Form.Item>
          <Form.Item label="Product Picture" name="picture">
            <Input placeholder="Product Picture URL" />
          </Form.Item>
          <Form.Item label="Product price" name="price">
            <Input
              placeholder="Product Price (ETH)"
              prefix={<FaEthereum size={10} />}
            />
          </Form.Item>
          <Button
            className="green-btn"
            htmlType="submit"
            loading={createProductMutation.isLoading}
          >
            List Product
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default SpecStore;
