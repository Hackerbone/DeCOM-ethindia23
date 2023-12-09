import { Avatar, Divider, Form, Input, Modal, Row, message } from "antd";
import React, { useEffect } from "react";
import styles from "styles/components/Modal.module.scss";
import formStyles from "styles/components/Form.module.scss";
import { useMutation } from "@tanstack/react-query";
import { addProductToVendor } from "services/vendor.service";
import { isValidUrl } from "components/createStoreOnboarding/Step1";
import { convertToEthers, convertToWei } from "utils/convert";
import PrimaryButton from "components/PrimaryButton";
import { useQueryClient } from "@tanstack/react-query";


const PlaceOrderModal = ({ visible, setVisible, storeAddress }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const closeModal = () => {
        setVisible(false);
    };

    //   const createProductMutation = useMutation({
    //     mutationFn: addProductToVendor,
    //     onSuccess: async (data) => {
    //       messageApi.success("Product created successfully");
    //       await queryClient.invalidateQueries("allvendorproducts");
    //       form.resetFields();
    //       closeModal();
    //     },
    //     onError: (error) => {
    //       messageApi.error(
    //         error?.response?.data?.message || "Something went wrong"
    //       );
    //     },
    //   });

    //   const handleCreateProduct = async (values) => {
    //     if (visible.edit) {
    //       // Edit product
    //     } else {
    //       const { name, price, picture } = values;
    //       if (!name || !price || !picture) {
    //         message.error("Please fill all the fields");
    //         return;
    //       }

    //       if (!isValidUrl(picture)) {
    //         message.error("Invalid picture URL");
    //         return;
    //       }

    //       await createProductMutation.mutateAsync({
    //         name: values.name,
    //         price: convertToWei(price),
    //         picture,
    //         vendorAddress: storeAddress,
    //       });
    //     }
    //   };

    //   useEffect(() => {
    //     if (visible.edit) {
    //       form.setFieldsValue({
    //         name: visible.name,
    //         price: convertToEthers(visible.price),
    //         picture: visible.picture,
    //       })
    //     } else {
    //       form.resetFields()
    //     }
    //   }, [visible, form])

    return (
        <>
            {contextHolder}
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
                        <Avatar
                            size={120}
                            shape="square"
                            src={
                                "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d7a7be55e6c94448a3181716f838fa22_9366/4DFWD_3_Running_Shoes_Grey_IG8980_HM1.jpg"
                            }
                        />
                        <div className={styles.itemDetails}>
                            <div className={styles.itemName}>Adidas Court 1</div>
                            <div className={styles.itemCategory}>Men's shoe</div>
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
                        <div className={styles.value}>09-12-2023</div>
                    </Row>
                    <Row className={styles.itemDetailsRow}>
                        <div className={styles.key}>Price:</div>
                        <div className={styles.value}>0.3666 ETH</div>
                    </Row>
                    <Divider className={styles.divider} />
                    <div className={styles.sectionTitle}>Shipping</div>


                    <Form
            form={form}
            className={`${formStyles.formContainer} ${styles.modalForm}`}
            layout="vertical"
            style={{marginTop:0}}
            // onFinish={handleCreateProduct}
          >
            <Form.Item
              name="address"
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
                // loading={createProductMutation.isLoading}
              >
                Place order
              </PrimaryButton>
            </Row>
          </Form>
                </div>
            </Modal>
        </>

    );
};

export default PlaceOrderModal;
