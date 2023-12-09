import { Avatar, Divider, Form, Input, Modal, Row, message } from "antd";
import React, { useEffect } from "react";
import styles from "styles/components/Modal.module.scss";
import formStyles from "styles/components/Form.module.scss";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "services/vendor.service";
import { convertToEthers } from "utils/convert";
import PrimaryButton from "components/PrimaryButton";
import moment from "moment";
import lighthouse from "@lighthouse-web3/sdk";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  encryptUsingLighthouse,
  encryptionSignature,
  handleShippingDetailsEncrypt,
} from "services/encryptUpload";
import { ethers } from "ethers";
import { getVendorByContractAddress } from "services/vendorfactory.service";
import { useSelector } from "react-redux";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { MdCheck } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getAadharStatus, setAadharVerfied } from "services/anon.service";

const PlaceOrderModal = ({ visible, setVisible, storeAddress }) => {
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
    // if (anonAadhaar?.status !== "logged-in") {
    //   message.error("Please verify your Aadhaar to place order");
    //   return;
    // }

    const { shippingAddress } = values;
    if (!shippingAddress) {
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
    const apiKey = "1a21c052.6fddd3e2c66f439e9e83c8f157af8b1e";
    const { publicKey, signedMessage } = await encryptionSignature();

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
    });

    // Encrypt self wallet address

    const { encryptedVendorShipping } = await handleShippingDetailsEncrypt({
      shippingDetails: shippingAddress,
      vendorWalletAddress,
    });

    // Common (DONT REMOVE)
    const input = document.getElementById("invoice");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0);

    const pdfBlob = pdf.output("blob");
    const file = new File([pdfBlob], `cus_${walletAddress}.pdf`, {
      type: "application/pdf",
    });

    const invoiceRes = await lighthouse.uploadEncrypted(
      file,
      apiKey,
      publicKey,
      signedMessage,
      (fd) => console.log({ fd })
    );

    console.log({ invoiceRes });

    const invoiceCID = invoiceRes?.data?.Hash;
    console.log(`Decrypt at https://decrypt.mesh3.network/evm/${invoiceCID}`);

    await placeOrderMutation.mutateAsync({
      vendorAddress: storeAddress,
      id: visible.id,
      encryptedData: encryptedVendorShipping,
      productPrice: visible.price,
    });
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
            <div className={styles.itemCategory}>{visible?.description}</div>
            {/* <div className={styles.itemPrice}><span>Price</span>0.366666 ETH</div> */}
          </div>
        </Row>
        <Divider className={styles.divider} />
        <div className={styles.sectionTitle}>Order Details</div>
        <Row className={styles.itemDetailsRow}>
          <div className={styles.key}>Order number:</div>
          <div className={styles.value}>#132234</div>
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
        <div className={styles.sectionTitle}>Verify your identity</div>
        <Row className={styles.itemDetailsRow}>
          <div className={styles.key}>
            Verify your identity using{" "}
            <span className={"green-text"}>anon aadhar's</span> anonymized
            Aadhaar validation to ensure secure and accurate shipping address
            confirmation.
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
        <div className={styles.sectionTitle}>Shipping</div>

        <Form
          form={form}
          className={`${formStyles.formContainer} ${styles.modalForm}`}
          layout="vertical"
          style={{ marginTop: 0 }}
          onFinish={handlePlaceOrder}
        >
          <Form.Item
            name="shippingAddress"
            className={formStyles.formItem}
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
