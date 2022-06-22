import { useState, useEffect, useContext } from "react";

import styles from "../../sass/profile/userDetails.module.scss";
import { GiStairsGoal } from "react-icons/gi";
import { RiUserUnfollowLine } from "react-icons/ri";
import { BiUserCheck } from "react-icons/bi";
import EditGoal from "../profile/EditGoal";
import UserContext from "../../UserContext";

const UserDetails = ({ user, workoutCount, isLoggedInUser, followStatus }) => {
  const [isFollowed, setIsFollowed] = useState(followStatus);
  const [followersNum, setFollowersNum] = useState(user.followersNum);
  const { setUser } = useContext(UserContext);

  const handleFollow = async () => {
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/users/followUser/${user.username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const { data, status } = await req.json();
    if (status === "success") {
      setUser((user) => ({
        ...user,
        following: [...user.following, data.followedUser],
      }));
      setIsFollowed(true);
      setFollowersNum((n) => n + 1);
    }
  };

  const handleUnfollow = async () => {
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/users/unfollowUser/${user.username}`,
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
      setUser((us) => ({
        ...us,
        following: us.following.filter((cur) => cur.username !== user.username),
      }));
      setIsFollowed(false);
      setFollowersNum((n) => n - 1);
    }
  };

  useEffect(() => {
    setIsFollowed(followStatus);
  }, [followStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img
          alt='user'
          src={`${import.meta.env.VITE_STATIC_URL}/img/users/${user.photo}`}
        />
      </div>
      <div className={styles.details}>
        <div className={styles.nameAndFollow}>
          <h3>{user.username}</h3>
          {!isLoggedInUser &&
            (isFollowed ? (
              <button onClick={handleUnfollow} className={styles.followedBtn}>
                <BiUserCheck className={styles.followedIcon} size={27} />
                <RiUserUnfollowLine className={styles.unfollowIcon} size={20} />
              </button>
            ) : (
              <button onClick={handleFollow}>follow</button>
            ))}
        </div>
        <div className={styles.stats}>
          <div>
            <span>{workoutCount}</span> workouts
          </div>
          <div>
            <span>{followersNum}</span> followers
          </div>
          <div>
            <span>{user.following.length}</span> following
          </div>
        </div>
        <div className={styles.centered}>
          <GiStairsGoal />{" "}
          {isLoggedInUser ? (
            <EditGoal />
          ) : (
            user.goals || "user has not set goals yet."
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
