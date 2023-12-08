import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser } from "store/user.slice";
import { useParams } from "react-router-dom";
import { getSpecVendorProducts, listAllVendors } from "services/vendor.service";
import { Card, Input } from "antd";
import Web3 from "web3";
import { FaEthereum } from "react-icons/fa";

const { Meta } = Card;
function SpecStore() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [vendorData, setVendorData] = useState({}); // [name, description, picture
  const { isConnected } = useSelector((state) => state.user);
  const { storeAddress } = useParams();
  console.log(storeAddress);

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

  console.log(vendorData);
  return (
    <div className="store-container">
      <div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "0.6rem" }}>
          {vendorData.name}
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
        {products?.map((item, idx) => {
          return (
            <Card
              key={idx}
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src={item.picture} />}
              // onClick={() => {
              //   navigate(`/stores/${item.vendorAddress}`);
              // }}
            >
              <Meta
                title={item.name}
                description={
                  <>
                    <div>
                      <FaEthereum size={10} />
                      ETH {web3.utils.fromWei(item.price.toString(), "ether")}
                    </div>
                    <div>{item.description}</div>
                  </>
                }
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default SpecStore;
