import { useContext, useState, useEffect } from "react";
import useEscape from "../../utils/useEscape";

import UserContext from "../../UserContext";
import { SocketContext } from "../../utils/socketContext";

import { animated, useTransition } from "react-spring";

import { PulseLoader } from "react-spinners";

import styles from "../../sass/user/notifications.module.scss";
import Notification from "./Notification";

const options = {
  from: { y: -100, zIndex: 100, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  leave: { y: -100, zIndex: -100, opacity: 0 },
};

const Notifications = ({ toggle, setToggle, setNewNotifsCounter }) => {
  const [notifications, setNotifications] = useState([]);
  const [totalNotifs, setTotalNotifs] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const [page, setPage] = useState(2);

  const socket = useContext(SocketContext);

  useEscape(setToggle);

  const handleReceiveNotification = (notif) => {
    console.log({ notif });
    setNotifications((prev) => [notif, ...prev]);
    setNewNotifsCounter((prev) => prev + 1);
  };

  const fetchNotifs = async (page = 1) => {
    try {
      setLoadingNotifs(true);
      const req = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/notifications?page=${page}&limit=4&sort=-createdAt`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const res = await req.json();
      if (res.status === "success") {
        const { notifications, total, totalNewNotifs } = res;

        return { total, notifications, totalNewNotifs };
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleLoadPrevNotifs = async () => {
    const { notifications } = await fetchNotifs(page);

    setNotifications((prevArr) => [...prevArr, ...notifications]);

    setPage((p) => p + 1);
  };

  const handleAllRead = () => {
    let markedNotifsNumber = 0;

    notifications.forEach(async (notif) => {
      if (!notif.readStatus) {
        markedNotifsNumber++;
        await fetch(
          `${import.meta.env.VITE_API_URL}/notifications/${notif._id}`,
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
            method: "PATCH",
          }
        );
      }
    });

    setNotifications(
      notifications.map((notif) => ({ ...notif, readStatus: true }))
    );

    setNewNotifsCounter((c) => c - markedNotifsNumber);
  };

  useEffect(() => {
    const clickHandler = (e) => {
      console.log({ id: e.target.id });
      if (
        e.target.id === "notifications" ||
        e.target.id === "notificationsButton" ||
        e.target.innerText === "preview" ||
        e.target.innerText === "follow" ||
        e.target.id === "closePreview" ||
        e.target.id === "likePreview" ||
        e.target.id === "replyPreviewInput"
      )
        return;
      setToggle(false);
    };
    window.addEventListener("click", clickHandler);
  }, []);

  useEffect(() => {
    (async () => {
      const { total, notifications, totalNewNotifs } = await fetchNotifs();
      setTotalNotifs(total);
      setNewNotifsCounter(totalNewNotifs);
      setNotifications(notifications);
    })();
  }, []);

  useEffect(() => {
    socket.on("RECEIVE_NOTIFICATION", handleReceiveNotification);

    return () => {
      socket.off("RECEIVE_NOTIFICATION", handleReceiveNotification);
    };
  }, [socket, handleReceiveNotification]);

  const transitions = useTransition(toggle, options);

  return transitions(
    (animationStyles, item) =>
      item && (
        <animated.div
          className={styles.container}
          id='notifications'
          style={animationStyles}
        >
          <div className={styles.header}>
            <span>notifications</span>
            {notifications.some((notif) => !notif.readStatus) && (
              <button className={styles.markAllBtn} onClick={handleAllRead}>
                mark all as read
              </button>
            )}
          </div>
          <hr style={{ margin: "0.5rem 0" }} />
          <div>
            {notifications.map((notif) => (
              <Notification
                notification={notif}
                key={notif._id}
                setToggle={setToggle}
                setNewNotifsCounter={setNewNotifsCounter}
                setNotifications={setNotifications}
              />
            ))}
          </div>
          {totalNotifs > notifications.length && !loadingNotifs && (
            <button
              className={styles.prevNotifsBtn}
              onClick={handleLoadPrevNotifs}
            >
              load previous
            </button>
          )}
          {loadingNotifs && (
            <div style={{ alignSelf: "center" }}>
              <PulseLoader color='white' />
            </div>
          )}
        </animated.div>
      )
  );
};

export default Notifications;
