import React from "react";
import styles from "styles/pages/CreateStore.module.scss";
import formStyles from "styles/components/Form.module.scss";

import { Form, Input, message } from "antd";
import PrimaryButton from "components/PrimaryButton";
import { createVendorContract } from "services/vendorfactory.service";
import { useMutation } from "@tanstack/react-query";

const OnboardingStep1 = ({ setCurrentStep }) => {
  const createVendorMutation = useMutation({
    mutationFn: createVendorContract,
    onSuccess: (data) => {
      message.success("Store created successfully");
      setCurrentStep(1);
    },
    onError: (err) => {
      console.log(err);
      message.error("Some error occured while creating store!");
    },
  });

  const createVendor = async (values) => {
    const { name, logo } = values;

    if (!name || !logo) {
      message.error("Please fill all details!");
      return;
    }
    if (!isValidUrl(logo)) {
      message.error("Enter a valid logo url!");
      return;
    }

    await createVendorMutation.mutateAsync({ name, logo });
  };

  return (
    <div className={styles.onboardingStepContainer}>
      <h1 className={styles.title}>Launch your web3 retail store</h1>
      <p className={styles.description}>Create your own brand</p>

      <Form
        className={`${formStyles.formContainer} ${styles.onboardingForm}`}
        layout="vertical"
        onFinish={createVendor}
      >
        <Form.Item
          name="name"
          label="Store Name"
          className={formStyles.formItem}
          rules={[{ required: true, message: "Please input your store name!" }]}
        >
          <Input className={formStyles.formInput} placeholder="My Web3 Store" />
        </Form.Item>

        <Form.Item
          name="logo"
          label="Brand logo"
          className={formStyles.formItem}
          rules={[
            {
              required: true,
              message: "Please enter your logo url",
            },
            {
              type: "url",
              message: "Enter a valid url",
            },
          ]}
        >
          <Input
            className={formStyles.formInput}
            placeholder="Enter your logo url"
          />
        </Form.Item>
        <PrimaryButton
          className={formStyles.formButton}
          htmlType="submit"
          loading={createVendorMutation.isLoading}
        >
          Continue
        </PrimaryButton>
      </Form>
    </div>
  );
};

export default OnboardingStep1;

export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};
