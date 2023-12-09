import { Image, Row } from "antd";
import Navbar from "components/Navbar";
import React from "react";
import styles from "styles/pages/Landing.module.scss";


export default function LandingPage() {

  return (
    <>
    <Navbar />
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <h1 className={styles.heroHeading}>Craft Your <span>Commerce</span> with Web3</h1>
        <p>Revolutionize online retail with our Web3 builder</p>
        <Row align="middle" className={styles.ctas}>
        <a href="/auth">I'm a vendor</a>
        <a href="/stores">I'm a customer</a>
        </Row>

        <div className={styles.airstackWrap}>
          <Image src="/vitalik_eth_collage.png" className={styles.airstackWrapImage} />
        </div>
      </div>
    </div>
    </>

  );
}
