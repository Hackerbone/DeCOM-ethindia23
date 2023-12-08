import React from "react";
import styles from "styles/pages/CreateStore.module.scss";
import formStyles from "styles/components/Form.module.scss";
import { Form, Image } from "antd";
import PrimaryButton from "components/PrimaryButton";
import checkMark from "assets/images/onboarding/check.svg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OnboardingStep4 = () => {
  const navigate = useNavigate();
  const { storeId } = useSelector((state) => state.user);

  const handleOk = () => {
    navigate(`/vendor/${storeId}`);
  };

  return (
    <div className={styles.onboardingStepContainer}>
      <h1 className={styles.title}>You’re all set</h1>
      <p className={styles.description}>
        Your store is now deployed and can be accessed at{" "}
        <a
          href={`http://127.0.0.1:3000/${storeId}`}
          target="_blank"
          rel="noreferrer"
        >
          http://127.0.0.1:3000/${storeId}
        </a>
      </p>
      <Form
        className={`${formStyles.formContainer} ${styles.onboardingForm}`}
        layout="vertical"
      >
        <Form.Item
          className={formStyles.formItem}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Image
            preview={false}
            src={checkMark}
            width={150}
            height={150}
            className={styles.checkMark}
          />
        </Form.Item>
        <PrimaryButton
          className={formStyles.formButton}
          htmlType="submit"
          onClick={handleOk}
        >
          Let's go
        </PrimaryButton>
      </Form>
    </div>
  );
};

export default OnboardingStep4;
