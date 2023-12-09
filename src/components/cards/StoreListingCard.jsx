import { Avatar, Card, Row, Tooltip } from 'antd'
import PrimaryButton from 'components/PrimaryButton'
import React from 'react'
import styles from "styles/pages/Stores.module.scss"
import { IoMdArrowForward } from "react-icons/io";
import { FaEthereum } from 'react-icons/fa';

const StoreListingCard = ({ item, handleSelectStore }) => {
    return (
        <Card className={styles.storeListingCardContainer}>
            <Row justify="space-between" className={styles.storeListBrand}>
                <Row align="middle" >
                    <Avatar size={48} src={item?.logo} className={styles.brandLogo}  />
                    <div className={styles.brandDetails}>
                        <div className={styles.brandName}>{item.name}</div>
                        <div className={styles.brandCategory}>Premium sports store</div>
                    </div>
                </Row>
                <Tooltip title={item.vendorAddress}>
                    <div className={styles.storeAddress}>
                        <FaEthereum className={styles.icon} />
                    </div>
                </Tooltip>
            </Row>
            <Row className={styles.description}>
                Adidas is a global sportswear brand known for its innovative designs. Adidas is a global sportswear brand known for its innovative designs. Adidas is a global sportswear brand known for its innovative designs.
            </Row>
            <Row justify="end">
                <PrimaryButton buttonType="text" className={styles.visitButton} onClick={() => handleSelectStore(item)}>Visit store<IoMdArrowForward /></PrimaryButton>
            </Row>
        </Card>
    )
}

export default StoreListingCard