import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser } from "store/user.slice";
import { useNavigate } from "react-router-dom";
import { listAllVendors } from "services/vendor.service";
import { Card, Input } from "antd";
const { Meta } = Card;
function Stores() {
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState([]);
  const { isConnected } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      listAllVendors()
        .then((vendors) => {
          console.log({ vendors });
          setVendors(vendors);
        })
        .catch((err) => {
          console.log("EREOREOR");
          console.log(err);
        });
    }
  }, [isConnected]);

  return (
    <div className="store-container">
      <div>
        <h1 style={{ fontSize: "3.5rem", marginBottom: "0.6rem" }}>
          Discover <span className="text-green">DeCom</span> stores
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
        {vendors.length} stores found
      </div>
      <div className="store-grid">
        {vendors?.map((item, idx) => {
          return (
            <Card
              key={idx}
              hoverable
              style={{ width: 240 }}
              cover={<img alt="example" src={item.logo} />}
              onClick={() => {
                navigate(`/stores/${item.vendorAddress}`);
              }}
            >
              <Meta title={item.name} description={item.vendorAddress} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Stores;
