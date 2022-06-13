import { useState, useContext, useEffect } from "react";

import { Link } from "react-router-dom";

import UserContext from "../../UserContext";

import styles from "../../sass/user/notification.module.scss";

import ReactTimeAgo from "react-time-ago";

const Notification = ({
  notification: {
    notifierUsername,
    notificationMessage,
    notifierImg,
    createdAt,
    readStatus,
    workoutId,
    workoutImg,
    _id,
  },
  setToggle,
  setNewNotifsCounter,
  setNotifications,
}) => {
  const {
    user: { following },
  } = useContext(UserContext);

  const checkUserFollowed = () =>
    following.some((follower) => follower.username === notifierUsername);

  const markNotifAsRead = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/${_id}`, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
      method: "PATCH",
    });

    setNotifications((notifs) =>
      notifs.map((notif) => {
        if (notif._id === _id) notif.readStatus = true;
        return notif;
      })
    );

    setNewNotifsCounter((c) => c - 1);
  };

  const handleClickNotif = async (e) => {
    if (!readStatus) await markNotifAsRead();

    if (e.target.innerText !== "follow") setToggle(false);
  };

  const linkStr = notificationMessage.includes("following")
    ? `/home/user/${notifierUsername}`
    : `/home/workout/${workoutId}`;

  return (
    <Link
      to={linkStr}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={handleClickNotif}
    >
      <div className={styles.container}>
        {!readStatus && <div className={styles.newNotifMark}></div>}
        <div className={styles.message}>
          <img
            className={styles.notifierImg}
            src={`${import.meta.env.VITE_STATIC_URL}/img/users/${notifierImg}`}
          />
          <div>
            <span style={{ fontWeight: "bold" }}>{notifierUsername}</span>
            {notificationMessage}{" "}
            <ReactTimeAgo
              date={createdAt}
              timeStyle='round-minute'
              locale='en-US'
            />
          </div>
        </div>
        {workoutImg ? (
          <img className={styles.workoutImg} src={workoutImg} />
        ) : !checkUserFollowed() ? (
          <button className={styles.followBtn}>follow</button>
        ) : (
          <></>
        )}
      </div>
    </Link>
  );
};

export default Notification;
