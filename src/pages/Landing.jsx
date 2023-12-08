import { Row } from "antd";
import React from "react";
import styles from "styles/pages/Landing.module.scss";


export default function LandingPage() {

  return (
    <div className={styles.homeContainer}>
      <Row className={styles.homeContent}>
        <a href="/auth">Login to Decom</a>
        <a href="/stores">Stores</a>
      </Row>
    </div>
  );
}
