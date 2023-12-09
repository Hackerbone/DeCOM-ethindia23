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
import ChatModal from "components/modals/ChatModal";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

const StoreOrders = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const [showChatModal, setShowChatModal] = React.useState(false);

  const productsDropdownItems = [
    {
      label: "Mark as delivered",
      icon: <FaCheckDouble className={styles.icon} />,
      onClick: async (record) => {
        console.log({ record });
        await markOrderAsShipped({
          order_id: record.id,
          vendorAddress: storeAddress,
        }).then(async () => {
          await queryClient.invalidateQueries("allvendororders");

          message.success(`Order ${record.id} marked as shipped`);
        });
      },
    },
    {
      label: "Chat",
      icon: <IoChatbubbleEllipsesSharp className={styles.icon} />,
      onClick: async (record) => {
        setShowChatModal(true)
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
    <>
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

    <ChatModal visible={showChatModal} setVisible={setShowChatModal} title="Chat with your customer" />
    </>
  );
};

export default StoreOrders;
