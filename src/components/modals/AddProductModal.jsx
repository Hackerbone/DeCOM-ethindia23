import { Form, Input, Modal, Row,  message } from 'antd'
import React from 'react'
import styles from "styles/components/Modal.module.scss"
import formStyles from "styles/components/Form.module.scss"
import { useMutation } from '@tanstack/react-query'
import { addProductToVendor } from 'services/vendor.service'
import { isValidUrl } from 'components/createStoreOnboarding/Step1'
import { convertToEthers } from 'utils/convert'
import PrimaryButton from 'components/PrimaryButton'
import { FaEthereum } from 'react-icons/fa'


const AddProductModal = ({
  visible,
  setVisible,
  storeAddress
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const closeModal = () => {
    setVisible(false)
  }

  const createProductMutation = useMutation({
    mutationFn: addProductToVendor,
    onSuccess: (data) => {
      messageApi.success('Product created successfully')
      form.resetFields()
    },
    onError: (error) => {
      messageApi.error(error?.response?.data?.message || "Something went wrong")
    }
  })


  const handleCreateProduct = async (values) => {
    if (visible.edit) {
      // Edit product
    } else {

      const { name, price, picture } = values;

      if (!name || !price || !picture) {
        message.error("Please fill all the fields");
        return;
      }


      if (!isValidUrl(picture)) {
        message.error("Invalid picture URL");
        return;
      }

      await createProductMutation.mutateAsync({
        name: values.name,
        price: Number(price),
        picture,
        vendorAddress: storeAddress,
      })
    }

  }

  // useEffect(() => {
  //   if (visible.edit) {
  //     form.setFieldsValue({
  //       resourceName: visible.resourceName,
  //       resourceKey: visible.resourceKey,
  //       description: visible.description,
  //       actions: visible.actions,
  //       tenant: tenantsList?.tenants?.find(tenant => tenant.tenantKey === visible.tenantKey)?._id
  //     })
  //   } else {
  //     form.resetFields()
  //   }
  // }, [visible, tenantsList, form])


  return (
    <>
      {contextHolder}
      <Modal
        open={visible}
        onCancel={closeModal}
        centered
        closeIcon={null}
        footer={null}
        className={styles.appModalContainer}
        width={600}
      >
        <div className={styles.appModalWrapper}>
          <div className={styles.modalHeader}>
            <h1 className={styles.heading}>{visible?.edit ? "Edit" : "Add"} Product</h1>
          </div>
          <Form
            form={form}
            className={`${formStyles.formContainer} ${styles.modalForm}`}
            layout='vertical'
            onFinish={handleCreateProduct}
          >
            <Form.Item
              name="name"
              label="Product Name"
              className={formStyles.formItem}
              rules={[
                {
                  required: true,
                  message: 'Please input a Product Name',
                }
              ]}
            >
              <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder="Enter Product Name" />
            </Form.Item>
            <Form.Item
              name="picture"
              label="Product picture url"
              className={formStyles.formItem}
              rules={[
                {
                  required: true,
                  message: 'Please input a Resource Key',
                },
                {
                  type: "url",
                  message: 'Enter a valid url!',

                }
              ]}

            >
              <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder="Product Picture URL" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Product price"
              className={formStyles.formItem}
              rules={[
                {
                  required: true,
                  message: 'Please input a Product price',
                }
              ]}
            >
              <Input className={`${formStyles.formInput} ${styles.modalInput}`} placeholder="Product Price (ETH)"  />
            </Form.Item>
            <Row justify="end" className={styles.modalButtonsContainer}>
              <PrimaryButton
                size="small"
                buttonType="text"
                className={`${styles.formButton} ${styles.modalCancelButton}`}
                onClick={closeModal}
              >Cancel</PrimaryButton>
              <PrimaryButton
                size="small"
                className={`${styles.formButton} ${styles.modalButton}`}
                htmlType='submit'
                loading={createProductMutation.isLoading}
              >{visible.edit ? "Save" : "Create Product"}</PrimaryButton>
            </Row>
          </Form>
        </div>
      </Modal>
    </>

  )
}

export default AddProductModal