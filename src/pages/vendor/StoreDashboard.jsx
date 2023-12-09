import { Col, DatePicker, Row } from "antd";
import DashboardLayout from "components/DashboardLayout";
import AverageOrderValueGraph from "components/cards/graphs/AverageOrderValueGraph";
import ConversionRateGraph from "components/cards/graphs/ConversionRateGraph";
import SalesGraphCard from "components/cards/graphs/SalesGraphCard";
import StoreSessionsGraph from "components/cards/graphs/StoreSessionsGraph";
import React from "react";
import styles from "styles/pages/Dashboard.module.scss";


const { RangePicker } = DatePicker;

const StoreDashboard = () => {
  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.heading}>Overview dashboard</h1>
        </div>
        <Row
          align="middle"
          justify="space-between"
          className={styles.actionsContainer}
        >
          <Col className={styles.filterContainer}>
            <RangePicker className={styles.filterRangePicker} />
          </Col>
        </Row>
        <div className={styles.dashboardTableContainer}>
          <Row className={styles.graphGrid}>
            <Col className={styles.graphGridCol}>
              <SalesGraphCard />
              <ConversionRateGraph />
            </Col>
            <Col className={styles.graphGridCol}>
              <StoreSessionsGraph />
              <AverageOrderValueGraph />
            </Col>
           
            

          </Row>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboard;
