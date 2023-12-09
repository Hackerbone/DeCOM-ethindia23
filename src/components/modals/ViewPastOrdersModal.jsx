import { Avatar, Col, Divider, Modal, Row, Tag, message } from "antd";
import React from "react";
import styles from "styles/components/Modal.module.scss";
import { getOrdersByCustomer } from "services/vendor.service";
import { isValidUrl } from "components/createStoreOnboarding/Step1";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import moment from "moment";
import PrimaryButton from "components/PrimaryButton";
import { decryptLighthouse } from "services/encryptUpload";

const ViewPastOrdersModal = ({
  visible,
  setVisible,
  setSupportChatModal,
  storeAddress,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const closeModal = () => {
    setVisible(false);
  };

  const { data } = useQuery({
    queryKey: ["get-past-orders", storeAddress],
    queryFn: async () => await getOrdersByCustomer(storeAddress),
    enabled: !!storeAddress,
  });

  const handleSupport = () => {
    setSupportChatModal(true);
    closeModal();
  };

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
          {console.log(data)}
          {data?.map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                {/* <div className={styles.sectionTitle}>Item Details</div> */}
                <Row align="middle" justify="space-between">
                  <Row align="middle" style={{ gap: 16 }}>
                    <div className={styles.itemDetails}>
                      <div className={styles.itemName}>
                        Product {item.productId}{" "}
                        <span className={styles.orderId}>
                          {item.isShipped ? "Shipped" : "In Transit"}
                        </span>
                      </div>
                      <div className={styles.itemCategory}>{item.customer}</div>
                      <div
                        className={styles.itemCategory}
                        style={{ marginTop: "0.5rem" }}
                      >
                        Purchased on: {moment(item.createdAt).format("lll")}
                      </div>
                      <PrimaryButton
                        style={{
                          marginTop: "1rem",
                        }}
                        onClick={async () => {
                          const decryptedInvoice = await decryptLighthouse(
                            item.invoiceCid
                          );
                          console.log({ decryptedInvoice });
                          const newpdfBlob = new Blob([decryptedInvoice], {
                            type: "application/pdf",
                          });
                          const file = new File(
                            [newpdfBlob],
                            `cus_${item.invoiceCid}.pdf`,
                            {
                              type: "application/pdf",
                            }
                          );
                          // download file
                          const link = document.createElement("a");
                          link.href = window.URL.createObjectURL(file);
                          link.download = `cus_${item.invoiceCid}.pdf`;
                          link.click();
                        }}
                      >
                        Download Invoice
                      </PrimaryButton>
                      {/* <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div> */}
                    </div>
                  </Row>
                  <Col>
                    <Tag className={styles.needHelpTag} onClick={handleSupport}>
                      Need help?
                    </Tag>
                  </Col>
                </Row>
                <Divider className={styles.divider} />
              </React.Fragment>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default ViewPastOrdersModal;
