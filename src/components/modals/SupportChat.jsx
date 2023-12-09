import {
  ChatView,
  ChatUIProvider,
  darkChatTheme,
  MODAL_POSITION_TYPE,
} from "@pushprotocol/uiweb";
import { Modal } from "antd";
import styles from "styles/components/Modal.module.scss";

const SupportChat = ({ visible, setVisible }) => {
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
      <ChatUIProvider theme={darkChatTheme}>
        <ChatView
          chatId="b8e068e02fe12d7136bc2f24408835573f30c6fbf0b65ea26ab4c7055a2c85f1"
          limit={10}
          isConnected={true}
          verificationFailModalPosition={MODAL_POSITION_TYPE.RELATIVE}
        />
      </ChatUIProvider>
    </Modal>
  );
};

export default SupportChat;
