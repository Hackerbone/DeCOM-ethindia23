import { Avatar, Divider, Form, Input, Modal, Radio, Row, message } from "antd";
import React, { useEffect } from "react";
import styles from "styles/components/Modal.module.scss";
import formStyles from "styles/components/Form.module.scss";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "services/vendor.service";
import { blobToBase64, convertToEthers } from "utils/convert";
import PrimaryButton from "components/PrimaryButton";
import moment from "moment";
import lighthouse from "@lighthouse-web3/sdk";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  // decryptLighthouse,
  encryptUsingLighthouse,
  encryptionSignature,
  handleShippingDetailsEncrypt,
} from "services/encryptUpload";
import { getVendorByContractAddress } from "services/vendorfactory.service";
import { useSelector } from "react-redux";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { MdCheck } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getAadharStatus, setAadharVerfied } from "services/anon.service";

const PlaceOrderModal = ({ visible, setVisible, storeAddress, wantsKYC }) => {
  const { walletAddress, isConnected } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("aadharStatus", anonAadhaar.status);
    if (anonAadhaar?.status === "logged-in") {
      console.log(anonAadhaar?.status);
    }
  }, [anonAadhaar]);

  const closeModal = () => {
    setVisible(false);
  };

  const { data: aadharStatus, isLoading: loadingAadharStatus } = useQuery({
    queryKey: ["get-buyer-aadhar-status", walletAddress],
    queryFn: async () =>
      await getAadharStatus({ walletAddress, vendorAddress: storeAddress }),
    enabled: isConnected && !!walletAddress,
  });

  useEffect(() => {
    (async () => {
      if (anonAadhaar?.status === "logged-in") {
        await handleVerifyAadhar();
      }
    })();
  }, [anonAadhaar]);

  const verifyAadharMutation = useMutation({
    mutationFn: setAadharVerfied,
    onSuccess: (res) => {
      message.success("Aadhar verified successfully");
    },
    onError: (err) => {
      console.log(err);
      message.error("Aadhar verification failed");
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (res) => {
      message.success("Order placed successfully");
      closeModal();
    },
    onError: (err) => {
      console.log(err);
      message.error("Product addition failed");
    },
  });

  const handlePlaceOrder = async (values) => {
    // if (anonAadhaar?.status !== "logged-in" && wantsKYC) {
    //   message.error("Please verify your Aadhaar to place order");
    //   return;
    // }

    const { shippingAddress, encryption } = values;
    if (!shippingAddress || !encryption) {
      message.error("Please fill all the fields");
      return;
    }

    if (!visible || !visible.id) {
      message.error("Invalid product");
      return;
    }

    if (!storeAddress) {
      message.error("Invalid store address");
      return;
    }

    const vendorWalletAddress = await getVendorByContractAddress(storeAddress);

    if (!vendorWalletAddress) {
      message.error("Invalid store wallet address");
      return;
    }

    // const apiKey = "3e9c735a.23e40d7f7cb544c09655e9070ffbeb57";
    // const apiKey = "1a21c052.6fddd3e2c66f439e9e83c8f157af8b1e";
    const apiKey = "e899de11.df498248e363489590d9b73739684bc3";

    const { publicKey, signedMessage } = await encryptionSignature();

    const input = document.getElementById("invoice");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0);
    const pdfBlob = pdf.output("blob");
    console.log({ pdfBlob });
    const pdfString = await blobToBase64(pdfBlob);

    console.log({ pdfString });

    const base64Data = pdfString.split(",")[1];

    const pdfresponse = await lighthouse.textUploadEncrypted(
      base64Data,
      apiKey,
      publicKey,
      signedMessage
    );
    console.log({ pdfresponse });
    const invoiceCid = pdfresponse?.data?.Hash;

    if (!invoiceCid) {
      message.error("Invoice upload failed, try again");
      return;
    }

    if (encryption === "lighthouse") {
      // Encrypt using lighthouse
      const encryptedData = await encryptUsingLighthouse({
        apiKey,
        shippingAddress,
        publicKey,
        signedMessage,
        storeAddress,
        vendorWalletAddress,
      });

      await placeOrderMutation.mutateAsync({
        vendorAddress: storeAddress,
        id: visible.id,
        encryptedData: encryptedData,
        productPrice: visible.price,
        isLighthouse: true,
        invoiceCid,
      });
    } else if (encryption === "self") {
      // Encrypt self wallet address
      const { encryptedVendorShipping } = await handleShippingDetailsEncrypt({
        shippingDetails: shippingAddress,
        vendorWalletAddress,
      });

      await placeOrderMutation.mutateAsync({
        vendorAddress: storeAddress,
        id: visible.id,
        encryptedData: encryptedVendorShipping,
        productPrice: visible.price,
        isLighthouse: false,
        invoiceCid,
      });
    }
  };

  const handleVerifyAadhar = async () => {
    await verifyAadharMutation.mutateAsync({
      walletAddress,
      vendorAddress: storeAddress,
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={closeModal}
      centered
      closeIcon={null}
      footer={null}
      className={`${styles.appModalContainer} ${styles.placeOrderModalContainer}`}
      width={800}
    >
      <div className={styles.appModalWrapper}>
        <div className={styles.modalHeader}>
          <h1 className={styles.heading}>Confirm your order</h1>
        </div>
        <div className={styles.sectionTitle}>Item Details</div>
        <Row align="top" style={{ gap: 16 }}>
          <Avatar size={120} shape="square" src={visible?.picture} />
          <div className={styles.itemDetails}>
            <div className={styles.itemName}>{visible?.name}</div>
            <div className={styles.itemCategory}>{visible?.category}</div>
            {/* <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div> */}
          </div>
        </Row>
        <Divider className={styles.divider} />
        <div className={styles.sectionTitle}>Order Details</div>
        <Row className={styles.itemDetailsRow}>
          <div className={styles.key}>Product number:</div>
          <div className={styles.value}>#{visible?.id}</div>
        </Row>
        <Row className={styles.itemDetailsRow}>
          <div className={styles.key}>Date:</div>
          <div className={styles.value}>{moment().format("DD-MM-YYYY")}</div>
        </Row>
        <Row className={styles.itemDetailsRow}>
          <div className={styles.key}>Price:</div>
          <div className={styles.value}>
            {convertToEthers(visible?.price || "")} ETH
          </div>
        </Row>
        <Divider className={styles.divider} />
        {wantsKYC && (
          <>
            <div className={styles.sectionTitle}>Verify your identity</div>
            <Row className={styles.itemDetailsRow}>
              <div className={styles.key}>
                Verify your identity using{" "}
                <span className={"green-text"}>anon aadhar's</span> anonymized
                Aadhaar validation to ensure secure and accurate shipping
                address confirmation.
              </div>
              <div className={styles.value}>
                {anonAadhaar?.status === "logged-out" || !aadharStatus ? (
                  <LogInWithAnonAadhaar />
                ) : (
                  <div className={styles.aadharVerfied}>
                    <MdCheck />
                    Success - Aadhaar verified!
                  </div>
                )}{" "}
              </div>
            </Row>
            <Divider className={styles.divider} />
          </>
        )}
        <div className={styles.sectionTitle}>Shipping</div>

        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.modalForm}`}
          layout="vertical"
          style={{ marginTop: 0 }}
          initialValues={{
            encryption: "lighthouse",
          }}
          onFinish={handlePlaceOrder}
        >
          <Form.Item
            name="shippingAddress"
            className={formStyles.formItem}
            style={{
              marginBottom: "0.5rem",
            }}
            rules={[
              {
                required: true,
                message: "Please input your shipping address Name",
              },
            ]}
          >
            <Input.TextArea
              className={`${formStyles.formTextArea} ${styles.modalInput}`}
              placeholder="Enter Shipping Address"
            />
          </Form.Item>
          <Form.Item
            name="encryption"
            className={formStyles.formItem}
            rules={[
              {
                required: true,
                message: "Please select an encryption type",
              },
            ]}
          >
            <Radio.Group className={formStyles.formRadioGroup}>
              <Radio value={"lighthouse"} className={formStyles.radio}>
                Encrypt with lighthouse
              </Radio>
              <Radio value={"self"} className={formStyles.radio}>
                Encrypt using self-signed wallet address
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Row justify="end" className={styles.modalButtonsContainer}>
            <PrimaryButton
              size="small"
              buttonType="text"
              className={`${styles.formButton} ${styles.modalCancelButton}`}
              onClick={closeModal}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              size="small"
              className={`${styles.formButton} ${styles.modalButton}`}
              htmlType="submit"
              loading={placeOrderMutation.isLoading}
            >
              Place order
            </PrimaryButton>
          </Row>
        </Form>
      </div>

      <div id="invoice">
        <h1>Order Invoice - {visible?.name}</h1>
        <h4>Customer: {walletAddress}</h4>
        <h4>Vendor: {storeAddress}</h4>
        <p>Order Number: {Math.random().toString(36).substr(2, 6)}</p>
        <p>Date: {moment().format("DD-MM-YYYY")}</p>
        <table>
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{visible?.id}</td>
              <td>{visible?.name}</td>
              <td>{convertToEthers(visible?.price ?? "0")} ETH</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default PlaceOrderModal;
