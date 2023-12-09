import DashboardLayout from "components/DashboardLayout";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row } from "antd";
import SendNotificationsForm from "components/createStoreOnboarding/SendNotificationsForm";
import axios from "axios";

const StoreMarketing = () => {
  const { storeAddress } = useParams();
  const { isConnected } = useSelector((state) => state.user);

  const handleSendNotification = async (values) => {
    try {
      const { title, data } = values;
      if (!title || !data) {
        console.log("Please fill all details!");
        return;
      }
      console.log(title, data);
      const res = await axios.post(
        "http://localhost:8080/api/push/trigger-notification",
        {
          subscribers: ["*"],
          title: title,
          notibody: data,
        }
      );
      console.log(res);
    } catch (error) {
      console.log(error);
      return <h1>Error</h1>;
    }

    console.log(values);
  };

  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Marketing</h1>
        </div>
        <Row justify="center" className={styles.marketingFormContainer}>
          <SendNotificationsForm
            handleSendNotification={handleSendNotification}
          />
        </Row>
      </div>
    </DashboardLayout>
  );
};

export default StoreMarketing;
