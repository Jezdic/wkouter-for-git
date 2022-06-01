import { useContext, useState, useReducer, useEffect } from "react";
import useEscape from "../../utils/useEscape";

import UserContext from "../../UserContext";
import { SocketContext } from "../../utils/socketContext";

import { animated, useTransition } from "react-spring";
import { BeatLoader } from "react-spinners";

import { AiOutlineMinusCircle } from "react-icons/ai";

import styles from "../../sass/user/notifications.module.scss";

const options = {
  from: { y: -100, zIndex: 100, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  leave: { y: -100, zIndex: -100, opacity: 0 },
};

const Notifications = ({ toggle, setToggle }) => {
  const socket = useContext(SocketContext);

  useEscape(setToggle);

  const handleReceiveNotification = (data) => {
    console.log(data);
  };

  useEffect(() => {
    socket.on("RECEIVE_NOTIFICATION", (data) => console.log(data));

    return () => {
      socket.off("RECEIVE_NOTIFICATION", handleReceiveNotification);
    };
  }, [socket, handleReceiveNotification]);

  const transitions = useTransition(toggle, options);

  return transitions(
    (animationStyles, item) =>
      item && (
        <animated.div className={styles.container} style={animationStyles}>
          notifications
          <hr style={{ margin: "0.5rem 0" }} />
        </animated.div>
      )
  );
};

export default Notifications;
