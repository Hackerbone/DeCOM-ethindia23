import { Avatar, Col, Divider, Image, Row } from 'antd'
import BuyerHeader from 'components/header/BuyerHeader'
import React, { useState } from 'react'
import styles from "styles/pages/Stores.module.scss"
import { VscVerifiedFilled } from "react-icons/vsc";
import { BsGlobe2, BsThreeDots } from 'react-icons/bs';
import { FaTwitter } from 'react-icons/fa';
import SearchBar from 'components/SearchBar';
import StoreItemCard from 'components/cards/StoreItemCard';
import PlaceOrderModal from 'components/modals/PlaceOrderModal';
import PrimaryButton from 'components/PrimaryButton';
import ViewPastOrdersModal from 'components/modals/ViewPastOrdersModal';

const TheStore = () => {
  const [buyProductModal, setBuyProductModal] = useState(false);
  const [pastOrdersModal, setPastOrdersModal] = useState(false);


    return (
        <>
            <BuyerHeader />
            <div className={styles.theStoresPageContainer}>
                <div className={styles.storeHeaderContainer}>
                    <Image src={"https://plus.unsplash.com/premium_photo-1676634832558-6654a134e920?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} preview={false} className={styles.banner} />
                    <div className={styles.storeDetailsContainer}>
                        <Avatar size={120} src={"https://cdn.britannica.com/94/193794-050-0FB7060D/Adidas-logo.jpg"} className={styles.storeLogo} />
                        <Row align="middle" justify="space-between" className={styles.storeDetails}>
                            <div className={styles.storeName}>Adidas <VscVerifiedFilled className={styles.verifyIcon} /></div>
                            <Row className={styles.storeSocials}>
                                <BsGlobe2 className={styles.social} />
                                <FaTwitter className={styles.social} />
                                <BsThreeDots className={styles.social} />
                            </Row>
                        </Row>
                        <div className={styles.storeDescription}><div className={styles.content}>Adidas, a leading sportswear manufacturer, is renowned for its high-quality athletic shoes, apparel, and accessories. Founded in Germany, it has a rich history in sports...</div> {"  "}See more</div>
                        <Row align="middle" className={styles.storeSpecs}>
                            <div className={styles.storeSpec}>Store items <span>1096</span></div>
                            <div className={styles.specSeparator} />
                            <div className={styles.storeSpec}>Chain <span>Ethereum</span></div>
                        </Row>
                    </div>
                </div>
                <div className={styles.pageContent}>
                    <Divider className={styles.divider} />
                    <Row align="middle" justify="space-between" className={styles.searchRow}>
                        <Row align="middle" style={{gap:10}} >
                        <SearchBar className={styles.bar} /><div className={styles.results}>108 results</div>
                        </Row>
                        <Col>
                        <PrimaryButton onClick={() => setPastOrdersModal(true)} className={styles.pastOrdersButton}>View past orders</PrimaryButton>
                        </Col>
                    </Row>
                    <div className={styles.itemsList}>
                        <StoreItemCard setBuyProductModal={setBuyProductModal} />
                        <StoreItemCard setBuyProductModal={setBuyProductModal} />
                        <StoreItemCard setBuyProductModal={setBuyProductModal} />
                        <StoreItemCard setBuyProductModal={setBuyProductModal} />
                        <StoreItemCard setBuyProductModal={setBuyProductModal} />
                        <StoreItemCard setBuyProductModal={setBuyProductModal} />

                    </div>
                </div>

                <PlaceOrderModal visible={buyProductModal} setVisible={setBuyProductModal} />
                <ViewPastOrdersModal visible={pastOrdersModal} setVisible={setPastOrdersModal} />
            </div>
        </>
    )
}

export default TheStore