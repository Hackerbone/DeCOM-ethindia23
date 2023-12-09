import React from 'react'
import styles from 'styles/components/Common.module.scss'

const ChatMessageCard = ({right, message, user}) => {
  return (
    <div className={`${styles.chatMessageCard} ${right ? styles.rightMessageCard : ""}`}>
        <div className={styles.user}>{user}</div>
        <div className={styles.chatMessage}>{message}</div>
    </div>
  )
}

export default ChatMessageCard