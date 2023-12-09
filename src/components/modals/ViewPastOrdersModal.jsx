import { Avatar, Col, Divider, Form, Input, Modal, Row, Tag, message } from "antd";
import React, { useEffect } from "react";
import styles from "styles/components/Modal.module.scss";
import formStyles from "styles/components/Form.module.scss";
import { useMutation } from "@tanstack/react-query";
import { addProductToVendor } from "services/vendor.service";
import { isValidUrl } from "components/createStoreOnboarding/Step1";
import { convertToEthers, convertToWei } from "utils/convert";
import PrimaryButton from "components/PrimaryButton";
import { useQueryClient } from "@tanstack/react-query";

const ViewPastOrdersModal = ({ visible, setVisible, setSupportChatModal }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const closeModal = () => {
        setVisible(false);
    };

    const handleSupport = ()=> {
        setSupportChatModal(true);
        closeModal();
    }

    return (
        <>
            {contextHolder}
            <Modal
                open={visible}
                onCancel={closeModal}
                centered
                closeIcon
                footer={null}
                className={`${styles.appModalContainer} ${styles.placeOrderModalContainer}`}
                width={800}
            >
                <div className={styles.appModalWrapper}>
                    <div className={styles.modalHeader}>
                        <h1 className={styles.heading}>Your past orders</h1>
                    </div>
                    {/* <div className={styles.sectionTitle}>Item Details</div> */}
                    <Row align="middle" justify="space-between">
                        <Row align="middle" style={{ gap: 16 }}>
                            <Avatar
                                size={72}
                                shape="square"
                                src={
                                    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d7a7be55e6c94448a3181716f838fa22_9366/4DFWD_3_Running_Shoes_Grey_IG8980_HM1.jpg"
                                }
                            />
                            <div className={styles.itemDetails}>
                                <div className={styles.itemName}>Adidas Court 1 <span className={styles.orderId}>#123234</span></div>
                                <div className={styles.itemCategory}>Men's shoe</div>
                                <div className={styles.itemCategory} style={{ marginTop: "0.5rem" }}>Purchased on: 29-10-2023</div>

                                {/* <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div> */}
                            </div>
                        </Row>
                        <Col>
                        <Tag color="yellow" className={styles.statusTag}>In-Transit</Tag>
                        <Tag className={styles.needHelpTag} onClick={handleSupport}>Need help?</Tag>
                        </Col>
                    </Row>
                    <Divider className={styles.divider} />
                    <Row align="middle" justify="space-between">
                        <Row align="middle" style={{ gap: 16 }}>
                            <Avatar
                                size={72}
                                shape="square"
                                src={
                                    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d7a7be55e6c94448a3181716f838fa22_9366/4DFWD_3_Running_Shoes_Grey_IG8980_HM1.jpg"
                                }
                            />
                            <div className={styles.itemDetails}>
                                <div className={styles.itemName}>Adidas Court 1 <span className={styles.orderId}>#123234</span></div>
                                <div className={styles.itemCategory}>Men's shoe</div>
                                <div className={styles.itemCategory} style={{ marginTop: "0.5rem" }}>Purchased on: 29-10-2023</div>

                                {/* <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div> */}
                            </div>
                        </Row>
                        <Col>
                        <Tag color="yellow" className={styles.statusTag}>In-Transit</Tag>
                        <Tag className={styles.needHelpTag}>Need help?</Tag>
                        </Col>
                    </Row>
                    <Divider className={styles.divider} />
                    <Row align="middle" justify="space-between">
                        <Row align="middle" style={{ gap: 16 }}>
                            <Avatar
                                size={72}
                                shape="square"
                                src={
                                    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d7a7be55e6c94448a3181716f838fa22_9366/4DFWD_3_Running_Shoes_Grey_IG8980_HM1.jpg"
                                }
                            />
                            <div className={styles.itemDetails}>
                                <div className={styles.itemName}>Adidas Court 1 <span className={styles.orderId}>#123234</span></div>
                                <div className={styles.itemCategory}>Men's shoe</div>
                                <div className={styles.itemCategory} style={{ marginTop: "0.5rem" }}>Purchased on: 29-10-2023</div>

                                {/* <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div> */}
                            </div>
                        </Row>
                        <Col>
                        <Tag color="yellow" className={styles.statusTag}>In-Transit</Tag>
                        <Tag className={styles.needHelpTag}>Need help?</Tag>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>

    );
}

export default ViewPastOrdersModal