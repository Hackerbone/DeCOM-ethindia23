import { Col, Row, message } from "antd";
import DashboardLayout from "components/DashboardLayout";
import React, { useEffect, useState } from "react";
import styles from "styles/pages/Dashboard.module.scss";
import SearchBar from "components/SearchBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrdersOfVendor,
  markOrderAsShipped,
  withdrawFunds,
} from "services/vendor.service";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StoreOrdersTable from "components/tables/StoreOrdersTable";
import { FaCheckDouble } from "react-icons/fa";
import Loader from "components/Loader";
import axios from "axios";
import ChatModal from "components/modals/ChatModal";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import PrimaryButton from "components/PrimaryButton";
import { ethers } from "ethers";
const StoreOrders = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Initialize ethers provider
        // Assuming MetaMask is used; otherwise, you can use Infura or other providers
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get contract balance
        const balanceInWei = await provider.getBalance(storeAddress);

        // Convert Wei to Ether
        const balanceInEth = ethers.utils.formatEther(balanceInWei);

        setBalance(balanceInEth);
      } catch (error) {
        console.error("Error fetching balance:", error);
        // Handle any errors
      }
    };

    fetchBalance();
  }, [storeAddress]);

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
    {
      label: "Chat",
      icon: <IoChatbubbleEllipsesSharp className={styles.icon} />,
      onClick: async (record) => {
        setShowChatModal(true);
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
            <Col className={styles.filterContainer}>
              <PrimaryButton
                size="small"
                onClick={async () => {
                  await withdrawFunds(storeAddress)
                    .then((res) => {
                      message.success("Funds withdrawn!");
                    })
                    .catch((err) => {
                      console.log(err);
                      message.error("Error withdrawing funds!");
                    });
                }}
              >
                Withdraw Funds - {balance} ETH
              </PrimaryButton>
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

      <ChatModal
        visible={showChatModal}
        setVisible={setShowChatModal}
        title="Chat with your customer"
      />
    </>
  );
};

export default StoreOrders;
