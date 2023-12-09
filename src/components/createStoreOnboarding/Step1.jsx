import React from "react";
import styles from "styles/pages/CreateStore.module.scss";
import formStyles from "styles/components/Form.module.scss";

import { Form, Input } from "antd";
import PrimaryButton from "components/PrimaryButton";


const OnboardingStep1 = ({ handleStep1 }) => {

  return (
    <div className={styles.onboardingStepContainer}>
      <h1 className={styles.title}>Launch your web3 retail store</h1>
      <p className={styles.description}>Create your own brand</p>

      <Form
        className={`${formStyles.formContainer} ${styles.onboardingForm}`}
        layout="vertical"
        onFinish={handleStep1}
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
