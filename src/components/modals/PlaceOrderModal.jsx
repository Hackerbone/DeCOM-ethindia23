import { Avatar, Divider, Form, Input, Modal, Row, message } from "antd";
import React from "react";
import styles from "styles/components/Modal.module.scss";
import formStyles from "styles/components/Form.module.scss";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "services/vendor.service";
import { convertToEthers } from "utils/convert";
import PrimaryButton from "components/PrimaryButton";
import moment from "moment";
import lighthouse from "@lighthouse-web3/sdk";
import {
  decryptUserMessage,
  handleShippingDetailsEncrypt,
} from "services/encryptUpload";
import { getVendorByContractAddress } from "services/vendorfactory.service";
import { useSelector } from "react-redux";
const PlaceOrderModal = ({ visible, setVisible, storeAddress }) => {
  const { walletAddress } = useSelector((state) => state.user);
  const [form] = Form.useForm();

  const closeModal = () => {
    setVisible(false);
  };

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

    const apiKey = "90d7bbf3.13366db08cb74c8d91875b87f2399e15";

    // sign the shipping address with the my public key
    const usignedShippingAddress = await window.ethereum.request({
      method: "personal_sign",
      params: [shippingAddress, walletAddress],
    });

    const response = await lighthouse.uploadText(
      shippingAddress,
      apiKey,
      "Jhoom barabar"
      //   walletAddress,
      //   usignedShippingAddress
    );

    console.log({ response });

    const vendorWalletAddress = await getVendorByContractAddress(storeAddress);

    console.log({ vendorWalletAddress, walletAddress, shippingAddress });

    // sign the shipping address with the vendor's public key
    const signedShippingAddress = await window.ethereum.request({
      method: "personal_sign",
      params: [shippingAddress, vendorWalletAddress],
      from: walletAddress,
    });

    const response2 = await lighthouse.uploadText(
      shippingAddress,
      apiKey,
      "Jhoom barabar 2"
      //   vendorWalletAddress,
      //   signedShippingAddress
    );

    console.log({ response2 });

    console.log({ signedShippingAddress });

    console.log({ usignedShippingAddress });

    // const { encryptedUserShipping, encryptedVendorShipping } =
    //   await handleShippingDetailsEncrypt({
    //     shippingDetails: shippingAddress,
    //     vendorWalletAddress,
    //     userWalletAddress: walletAddress,
    //   });

    // await placeOrderMutation.mutateAsync({
    //   vendorAddress: storeAddress,
    //   id: visible.id,
    //   shippingAddress: encryptedUserShipping,
    //   vendorShippingAddress: encryptedVendorShipping,
    //   productPrice: visible.price,
    // });
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
    </Modal>
  );
};

export default PlaceOrderModal;
