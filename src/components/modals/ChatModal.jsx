import { Input, Modal } from "antd";
import PrimaryButton from "components/PrimaryButton";
import ChatMessageCard from "components/cards/ChatMessageCard";
import { IoIosSend } from "react-icons/io";
import styles from "styles/components/Modal.module.scss";

const ChatModal = ({ visible, setVisible, title }) => {
    const closeModal = () => {
        setVisible(false);

    };
    return (
        <Modal
            open={visible}
            onCancel={closeModal}
            centered
            closeIcon
            footer={null}
            className={`${styles.appModalContainer} ${styles.chatModalContainer}`}
            width={800}
        >
            <div className={styles.appModalWrapper}>
                <div className={styles.modalHeader}>
                    <h1 className={styles.heading}>{title ?? "Support chat"}</h1>
                </div>

                <div className={styles.chatContainer}>
                    <div className={styles.chatMessagesContainer}>
                        <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />
                        <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />  <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />  <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />  <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />  <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />  <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />  <ChatMessageCard user="aditya" message={"Hi"} />
                        <ChatMessageCard right user="aditya" message={"Hi"} />


                        </div>
                    <div className={styles.chatInputContainer}>
                    <Input className={styles.chatInput} placeholder="Type your message here" />
                    <PrimaryButton className={styles.chatSendButton} icon={<IoIosSend />} />
                    </div>
                </div>

            </div>
        </Modal>
    );
};

export default ChatModal;
