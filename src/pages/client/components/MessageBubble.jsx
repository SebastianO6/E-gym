import React from "react";
import styles from "./MessageBubble.module.css";

const MessageBubble = ({ text, from }) => {
  const isClient = from === "client";

  return (
    <div className={`${styles.bubble} ${isClient ? styles.client : styles.trainer}`}>
      {text}
    </div>
  );
};

export default MessageBubble;
