import { Card, Image } from 'antd'
import React from 'react'
import styles from "styles/pages/Stores.module.scss"

const StoreItemCard = ({ setBuyProductModal }) => {
    return (
        <Card className={styles.itemCardContainer}>
            <Image preview={false} src={"https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d7a7be55e6c94448a3181716f838fa22_9366/4DFWD_3_Running_Shoes_Grey_IG8980_HM1.jpg"} className={styles.itemCardImage} />
            <div className={styles.itemDetails}>
                <div className={styles.itemName}>Adidas Court 1</div>
                <div className={styles.itemCategory}>Men's shoe</div>
                <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div>
            </div>
            <div className={styles.itemCardFooter} onClick={() => setBuyProductModal(true)}>Buy Now ( 0.3666666 ETH )</div>
        </Card>
    )
}

export default StoreItemCard