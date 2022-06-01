import { Link } from "react-router-dom";

import { MdOutlineCancel } from "react-icons/md";

import styles from "../../sass/feed/followingList.module.scss";

const FollowedUser = ({ user, setUser }) => {
  const handleUnfollow = async () => {
    try {
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
          following: us.following.filter(
            (cur) => cur.username !== user.username
          ),
        }));
      }
    } catch (error) {}
  };

  return (
    <div className={styles.followedUser}>
      <img
        className={styles.profilePic}
        src={`${import.meta.env.VITE_STATIC_URL}/img/users/${user.photo}`}
        alt='following'
      />
      <Link className={styles.link} to={`/home/user/${user.username}`}>
        {user.username}
      </Link>
      <MdOutlineCancel
        className={styles.unfollowBtn}
        onClick={handleUnfollow}
      />
    </div>
  );
};

export default FollowedUser;
