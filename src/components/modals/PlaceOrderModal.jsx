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
import {
  decryptLighthouse,
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

    /**Comment start */
    // const apiKey = "90d7bbf3.13366db08cb74c8d91875b87f2399e15";
    const apiKey = "3e9c735a.23e40d7f7cb544c09655e9070ffbeb57";

    // sign the shipping address with the my public key
    // const usignedShippingAddress = await window.ethereum.request({
    //   method: "personal_sign",
    //   params: [shippingAddress, walletAddress],
    // });

    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.textUploadEncrypted(
      shippingAddress,
      apiKey,
      publicKey,
      signedMessage
    );

    console.log({ response });

    const cid = response?.data?.Hash;

    const vendorWalletAddress = await getVendorByContractAddress(storeAddress);

    const shareFileRes = await lighthouse.shareFile(
      publicKey,
      [vendorWalletAddress],
      cid,
      signedMessage
    );

    console.log(shareFileRes);

    // const decryptData = await decryptLighthouse(cid);
    // console.log("===========Decrypt Data===========");
    // console.log({ decryptData });

    // console.log({ vendorWalletAddress, walletAddress, shippingAddress });

    // const { encryptedUserShipping, encryptedVendorShipping } =
    //   await handleShippingDetailsEncrypt({
    //     shippingDetails: shippingAddress,
    //     vendorWalletAddress,
    //     userWalletAddress: walletAddress,
    //   });

    // // sign the shipping address with the vendor's public key
    // const vsignedShippingAddress = await window.ethereum.request({
    //   method: "personal_sign",
    //   params: [shippingAddress, vendorWalletAddress],
    //   from: walletAddress,
    // });

    // const response2 = await lighthouse.textUploadEncrypted(
    //   shippingAddress,
    //   apiKey,
    //   vendorWalletAddress,
    //   vsignedShippingAddress,
    //   "Lets test 2"
    // );

    // console.log({ response2 });

    // console.log({ vsignedShippingAddress });

    // console.log({ usignedShippingAddress });

    /**Comment end */

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

    await placeOrderMutation.mutateAsync({
      vendorAddress: storeAddress,
      id: visible.id,
      shippingAddress: cid,
      vendorShippingAddress: cid,
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
    </Modal>
  );
};

async function getSignerForAddress(address) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Request access to the user's Ethereum accounts
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  // Check if the requested address is among the connected accounts
  if (accounts.includes(address)) {
    // Get the signer for the connected account
    const signer = provider.getSigner(accounts.indexOf(address));
    return signer;
  } else {
    throw new Error("Requested address is not connected");
  }
}

export default PlaceOrderModal;
