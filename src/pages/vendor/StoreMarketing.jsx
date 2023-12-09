import DashboardLayout from "components/DashboardLayout";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row } from "antd";
import SendNotificationsForm from "components/createStoreOnboarding/SendNotificationsForm";


const StoreMarketing = () => {
    const { storeAddress } = useParams();
    const { isConnected } = useSelector((state) => state.user);

    const handleSendNotification = async (values) => {
        console.log(values);
    }


    return (
        <DashboardLayout>
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeader}>
                    <h1 className={styles.heading}>Marketing</h1>
                </div>
                <Row justify="center" className={styles.marketingFormContainer}>
                    <SendNotificationsForm handleSendNotification={handleSendNotification} />
                </Row>
            </div>
        </DashboardLayout>
    );
};

export default StoreMarketing;
