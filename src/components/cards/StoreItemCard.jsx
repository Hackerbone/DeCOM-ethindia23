import { Card, Image } from "antd";
import React from "react";
import styles from "styles/pages/Stores.module.scss";
import { convertToEthers } from "utils/convert";

const StoreItemCard = ({ hanldePlaceOrder, item }) => {
  return (
    <Card className={styles.itemCardContainer}>
      <Image
        preview={false}
        src={item.picture}
        className={styles.itemCardImage}
      />
      <div className={styles.itemDetails}>
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.itemCategory}>{item.description}</div>
        <div className={styles.itemPrice}>
          <span>Price</span>
          {convertToEthers(item.price)} ETH
        </div>
      </div>
      <div
        className={styles.itemCardFooter}
        onClick={() => hanldePlaceOrder(item)}
      >
        Buy Now ( 0.3666666 ETH )
      </div>
    </Card>
  );
};

export default StoreItemCard;
