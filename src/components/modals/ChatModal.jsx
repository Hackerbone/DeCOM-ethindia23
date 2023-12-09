import { Input, Modal } from "antd";
import PrimaryButton from "components/PrimaryButton";
import ChatMessageCard from "components/cards/ChatMessageCard";
import { IoIosSend } from "react-icons/io";
import styles from "styles/components/Modal.module.scss";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import React, { useEffect } from "react";

const ChatModal = ({ visible, setVisible, title, userId }) => {
  const [user, setUser] = React.useState(null);
  const [sendMsg, setSendMsg] = React.useState("");

  const [chatMessages, setChatMessages] = React.useState([]);

  const sendMessage = async () => {
    try {
      let reciever_address = userId;

      const sendMessage = await user.chat.send(reciever_address, {
        type: "Text",
        content: sendMsg,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const user_basic = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      setUser(user_basic);

      let reciever_address = userId;
      console.log(reciever_address);
      const sendMessage = await user_basic.chat.send(reciever_address, {
        type: "Text",
        content: "Gm gm! its kathan from ethindia",
      });
      // Initialize Stream
      const stream = await user_basic.initStream([CONSTANTS.STREAM.CHAT]);

      // Configure stream listen events and what to do
      stream.on(CONSTANTS.STREAM.CHAT, (message) => {
        console.log(message);
        let msg = {
          from: message.from,
          content: message.message.content,
        };
        setChatMessages((prev) => [...prev, msg]);
      });
      // Connect Stream
      stream.connect();
    })();
  }, [visible]);

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
        {console.log(userId)}
        {console.log(chatMessages)}

        <div className={styles.chatContainer}>
          <div className={styles.chatMessagesContainer}>
            {chatMessages.map((item) => {
              if (item.from === `eip155:${userId}`) {
                return <ChatMessageCard user="aditya" message={item.content} />;
              } else {
                return (
                  <ChatMessageCard right user="kathan" message={item.content} />
                );
              }
            })}
          </div>
          <div className={styles.chatInputContainer}>
            <Input
              className={styles.chatInput}
              placeholder="Type your message here"
              onChange={(e) => {
                setSendMsg(e.target.value);
              }}
            />
            <PrimaryButton
              className={styles.chatSendButton}
              onClick={() => sendMessage()}
              icon={<IoIosSend />}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
