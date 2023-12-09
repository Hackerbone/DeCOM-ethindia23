import React from "react";
import styles from "styles/pages/CreateStore.module.scss";
import formStyles from "styles/components/Form.module.scss";

import { Form, Row } from "antd";
import PrimaryButton from "components/PrimaryButton";

import { HiOutlineIdentification } from "react-icons/hi"
import { RiUserLine } from "react-icons/ri"

const OnboardingStep2 = ({ createVendor, loading }) => {
  const [requireKyc, setRequireKyc] = React.useState(true)

  return (
    <div className={styles.onboardingStepContainer}>
      <h1 className={styles.title}>You want your customers to be KYC verified?</h1>
      <p className={styles.description}>This will help you know that your customers are humans</p>

      <Form className={`${formStyles.formContainer} ${styles.onboardingForm}`} layout='vertical'>
        <Form.Item
          className={formStyles.formItem}
        >
          <Row className={styles.useGroup}>
            <div onClick={() => {
              setRequireKyc(true)
            }} className={`${styles.useButton} ${requireKyc && styles.activeUseButton}`}>
              <HiOutlineIdentification className={styles.useIcon} />
              <div className={styles.useTitle}>Require KYC</div>
              <div className={styles.useSubTitle}>
                I want my customers to be KYC verfied before placing an order.</div>
            </div>
            <div onClick={() => {
              setRequireKyc(false)
            }} className={`${styles.useButton} ${!requireKyc && styles.activeUseButton}`}>
              <RiUserLine className={styles.useIcon} />
              <div className={styles.useTitle}>KYC not required</div>
              <div className={styles.useSubTitle}>
                I don't mind my customers even if they are not KYC verified.</div>
            </div>

          </Row>
        </Form.Item>
        <PrimaryButton
          loading={loading}
          className={formStyles.formButton}
          onClick={() => createVendor({ wantsKYC: requireKyc })}
        >Continue</PrimaryButton>
      </Form>

    </div>
  );
};

export default OnboardingStep2;

