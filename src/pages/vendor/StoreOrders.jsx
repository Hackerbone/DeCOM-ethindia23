import { Col, Row } from "antd";
import DashboardLayout from "components/DashboardLayout";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";
import SearchBar from "components/SearchBar";
import { MdOutlineModeEdit } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { showConfirm } from "components/modals/ConfirmModal";
import { useQuery } from "@tanstack/react-query";
import { getOrdersOfVendor } from "services/vendor.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StoreOrdersTable from "components/tables/StoreOrdersTable";

const StoreOrders = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);

  const productsDropdownItems = [
    {
      label: "Edit Product",
      icon: <MdOutlineModeEdit className={styles.icon} />,
      onClick: (record) => {},
    },
    {
      label: "Delete Resource",
      icon: <BiTrash className={styles.icon} />,
      onClick: (record) =>
        showConfirm({
          title: `Are you sure you want to delete this product?`,
          content: `This action cannot be undone.`,
          onOk: async () => {},
        }),
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

  if (isLoading) return <div>Loading...</div>;

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
              placeholder="Search products"
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
