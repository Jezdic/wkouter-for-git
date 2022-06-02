import { useContext, useState, useReducer, useEffect } from "react";
import useEscape from "../../utils/useEscape";

import UserContext from "../../UserContext";
import { SocketContext } from "../../utils/socketContext";

import { animated, useTransition } from "react-spring";
import { BeatLoader } from "react-spinners";

import { AiOutlineMinusCircle } from "react-icons/ai";

import styles from "../../sass/user/notifications.module.scss";
import Notification from "./Notification";

const options = {
  from: { y: -100, zIndex: 100, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  leave: { y: -100, zIndex: -100, opacity: 0 },
};

const dummyData = [
  {
    readStatus: true,
    _id: "629895e3ac467828b8ca035d",
    notifierUsername: "tama",
    notifierImg: "user-61dad1eceb3fe22078d306be-1641730598389.jpeg",
    notifiedUserId: "61daeb035d6091001666097b",
    notifiedUsername: "jezdic",
    notificationMessage: " started following you.",
    createdAt: "2022-06-02T10:50:11.537Z",
  },
  {
    readStatus: false,
    _id: "629895d5ac467828b8ca035c",
    notifierUsername: "tama",
    notifierImg: "user-61dad1eceb3fe22078d306be-1641730598389.jpeg",
    workoutId: "623722ee16888414c8419731",
    workoutImg:
      "http://res.cloudinary.com/dlsovnnst/image/upload/v1652654233/ahl8wcnvupej2rmg6mcw.jpg",
    notifiedUserId: "61daeb035d6091001666097b",
    notifiedUsername: "jezdic",
    notificationMessage: " commented on your workout.",
    createdAt: "2022-06-02T10:49:57.463Z",
  },
];

const Notifications = ({ toggle, setToggle }) => {
  const [notifications, setNotifications] = useState(dummyData);

  const socket = useContext(SocketContext);

  useEscape(setToggle);

  const handleReceiveNotification = (data) => {
    console.log(data);
  };

  const fetchNotifs = async () => {
    try {
      const req = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/notifications?page=${1}&limit=${4}&sort=-createdAt`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const res = await req.json();
      console.log(res);
      if (res.status === "success") {
        setNotifications(res.notifications);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

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
          <div className={styles.header}>
            <span>notifications</span>
            <button className={styles.markAllBtn}>mark all as read</button>
          </div>
          <hr style={{ margin: "0.5rem 0" }} />
          <div>
            {notifications.map((notif) => (
              <Notification notification={notif} key={notif._id} />
            ))}
          </div>
        </animated.div>
      )
  );
};

export default Notifications;
