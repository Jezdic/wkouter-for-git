import { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

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
    setUser,
  } = useContext(UserContext);

  const navigate = useNavigate();

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

  const navigateLink = notificationMessage.includes("following")
    ? `/home/user/${notifierUsername}`
    : `/home/workout/${workoutId}`;

  const handleClickNotif = async (e) => {
    if (!readStatus) await markNotifAsRead();

    if (e.target.innerText === "follow") return;

    setToggle(false);

    navigate(navigateLink);
  };

  const handleFollow = async () => {
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/users/followUser/${notifierUsername}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await req.json();
    if (data.status === "success") {
      setUser((user) => ({
        ...user,
        following: [...user.following, data.data.followedUser],
      }));
    }
  };

  return (
    <div className={styles.container} onClick={handleClickNotif}>
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
        <button className={styles.followBtn} onClick={handleFollow}>
          follow
        </button>
      ) : (
        <></>
      )}
      {notificationMessage.includes("") && (
        <span className={styles.previewComment}></span>
      )}
    </div>
  );
};

export default Notification;
