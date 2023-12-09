import {
  ChatView,
  ChatUIProvider,
  darkChatTheme,
  MODAL_POSITION_TYPE,
} from "@pushprotocol/uiweb";
import { Modal } from "antd";
import styles from "styles/components/Modal.module.scss";

const SupportChatModal = ({ visible, setVisible }) => {
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
          <h1 className={styles.heading}>Chat with the store</h1>
        </div>
        <ChatUIProvider theme={darkChatTheme}>
          <ChatView
            chatId="b8e068e02fe12d7136bc2f24408835573f30c6fbf0b65ea26ab4c7055a2c85f1"
            limit={10}
            isConnected={true}
            verificationFailModalPosition={MODAL_POSITION_TYPE.RELATIVE}
          />
        </ChatUIProvider>
      </div>
    </Modal>
  );
};

export default SupportChatModal;
