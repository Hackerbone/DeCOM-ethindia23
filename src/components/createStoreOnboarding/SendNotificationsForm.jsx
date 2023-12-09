import React from "react";
import styles from "styles/pages/CreateStore.module.scss";
import formStyles from "styles/components/Form.module.scss";
import dashboardStyles from "styles/pages/Dashboard.module.scss";
import { Form, Input } from "antd";
import PrimaryButton from "components/PrimaryButton";
import { IoIosSend } from "react-icons/io";


const SendNotificationsForm = ({handleSendNotification}) => {

    return (
        <div className={`${styles.onboardingStepContainer} ${dashboardStyles.sendNotificationFormContainer}`}>
            <h1 className={styles.title}>Send Notification</h1>
            <p className={styles.description}>Notify your customers regarding your latest launch</p>

            <Form
                className={`${formStyles.formContainer} ${styles.onboardingForm}`}
                style={{ marginTop: "3rem" }}
                layout="vertical"
                onFinish={handleSendNotification}
            >
                <Form.Item
                    name="title"
                    label="Notification Title"
                    className={formStyles.formItem}
                    rules={[{ required: true, message: "Please input your title!" }]}
                >
                    <Input className={formStyles.formInput} placeholder="New product launch" />
                </Form.Item>

                <Form.Item
                    name="data"
                    label="Notification Content"
                    className={formStyles.formItem}
                    rules={[
                        {
                            required: true,
                            message: "Please enter your notification content",
                        }
                    ]}
                >
                    <Input.TextArea
                        className={formStyles.formTextArea}
                        placeholder="Enter your notification content"
                    />
                </Form.Item>
                <PrimaryButton
                    className={formStyles.formButton}
                    htmlType="submit"
                    icon={<IoIosSend />}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap:0
                    }}
                >
                    Send
                </PrimaryButton>
            </Form>
        </div>
    );
};

export default SendNotificationsForm;
