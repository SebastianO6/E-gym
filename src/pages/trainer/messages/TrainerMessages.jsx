import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./TrainerMessages.module.css";
import MessagesList from "./MessagesList";
import ChatWindow from "./ChatWindow";

export default function TrainerMessages(){
  // This component might render two-column layout: list + chat window
  // But router will render: /trainer/messages -> this component (show list),
  // and /trainer/messages/:memberId -> separate chat component. To keep it simple:
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <MessagesList />
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>
    </div>
  );
}
