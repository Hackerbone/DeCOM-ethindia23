import { Col, Row, message } from "antd";
import DashboardLayout from "components/DashboardLayout";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";
import SearchBar from "components/SearchBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrdersOfVendor, markOrderAsShipped } from "services/vendor.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StoreOrdersTable from "components/tables/StoreOrdersTable";
import { FaCheckDouble } from "react-icons/fa";
import Loader from "components/Loader";
import axios from "axios";

const StoreOrders = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const productsDropdownItems = [
    {
      label: "Order Shipped",
      icon: <FaCheckDouble className={styles.icon} />,
      onClick: async (record) => {
        console.log({ record });
        await markOrderAsShipped({
          order_id: record.id,
          vendorAddress: storeAddress,
        });

        const userAddress = await getOrdersOfVendor(storeAddress);
        console.log(userAddress);
        let shippedSubscriber = [];
        await userAddress.map(async (item) => {
          if (item.id === record.id) shippedSubscriber.push(item.customer);
        });

        const res = await axios.post(
          "http://localhost:8080/api/push/trigger-notification",
          {
            subscribers: shippedSubscriber,
            title: "Update on your product",
            notibody: "Your product has been shipped",
          }
        );
        console.log(res);

        await queryClient.invalidateQueries("allvendororders");
        message.success(`Order ${record.id} marked as shipped`);
      },
    },
  ];

  const { data: allOrders, isLoading } = useQuery({
    queryKey: ["allvendororders"],
    queryFn: async () => await getOrdersOfVendor(storeAddress),
    enabled: isConnected,
  });

  console.log({
    allOrders,
  });

  if (isLoading) return <Loader />;

  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>All Orders</h1>
        </div>
        <Row
          align="middle"
          justify="space-between"
          className={styles.actionsContainer}
        >
          <Col className={styles.filterContainer}>
            <SearchBar
              placeholder="Search orders"
              className={styles.filterbar}
            />
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <StoreOrdersTable
            ordersDropdownItems={productsDropdownItems}
            orders={allOrders}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreOrders;
