import { Avatar, Col, Divider, Modal, Row, Tag, message } from "antd";
import React from "react";
import styles from "styles/components/Modal.module.scss";
import { getOrdersByCustomer } from "services/vendor.service";
import { isValidUrl } from "components/createStoreOnboarding/Step1";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import moment from "moment";
import PrimaryButton from "components/PrimaryButton";
import { decryptLighthouse } from "services/encryptUpload";
import { useSelector } from "react-redux";
import { convertToEthers } from "utils/convert";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
const ViewPastOrdersModal = ({
  visible,
  setVisible,
  setSupportChatModal,
  storeAddress,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { walletAddress } = useSelector((state) => state.user);
  const [selected, setSelected] = React.useState(null);
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
                          setSelected(item);
                          await decryptLighthouse(item.invoiceCid);
                          const input = document.getElementById("invoice-new");
                          const canvas = await html2canvas(input);
                          const imgData = canvas.toDataURL("image/png");
                          const pdf = new jsPDF();
                          pdf.addImage(imgData, "PNG", 0, 0);

                          const pdfBlob = pdf.output("blob");

                          const file = new File(
                            [pdfBlob],
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
        <div id="invoice-new">
          <h1>Order Invoice</h1>
          <h4>Customer: {walletAddress}</h4>
          <h4>Vendor: {storeAddress}</h4>
          <p>Order Number: {Math.random().toString(36).substr(2, 6)}</p>
          <p>Date: {moment().format("DD-MM-YYYY")}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product ID: {selected?.id}</td>
                <td>{selected?.invoiceCid}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default ViewPastOrdersModal;
