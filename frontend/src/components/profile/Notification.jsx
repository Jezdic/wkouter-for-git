import { useState, useContext, useEffect } from "react";

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
  },
}) => {
  const {
    user: { following },
  } = useContext(UserContext);

  const checkUserFollowed = () =>
    following.some((follower) => follower.username === notifierUsername);

  return (
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
  );
};

export default Notification;
