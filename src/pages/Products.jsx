import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser } from "store/user.slice";
import { useParams } from "react-router-dom";
import { getSpecVendorProducts, listAllVendors } from "services/vendor.service";
import { Input, Table, Button } from "antd";
import Web3 from "web3";
import { FaEthereum, FaPlus } from "react-icons/fa";

function SpecStore() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [vendorData, setVendorData] = useState({});
  const { isConnected } = useSelector((state) => state.user);
  const { storeAddress } = useParams();

  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/1a2f1d6b0e5e4b0b8d0b2f8a2d8c4a6e"
    )
  ); // Initialize web3 with your Ethereum provider

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      getSpecVendorProducts(storeAddress)
        .then((prod) => {
          console.log(prod);
          setProducts(prod);
        })
        .catch((err) => {
          console.log(err);
        });

      listAllVendors()
        .then((vendors) => {
          for (let i = 0; i < vendors.length; i++) {
            if (vendors[i].vendorAddress === storeAddress) {
              setVendorData(vendors[i]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isConnected, storeAddress]);

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
        <Button className="green-btn" htmlType="submit">
          Add Products <FaPlus size={10} />
        </Button>
      </div>

      <div style={{ margin: "1rem 0", marginTop: "2rem", fontWeight: "400" }}>
        {products.length} stores found
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        bordered={false}
      />
    </div>
  );
}

export default SpecStore;
