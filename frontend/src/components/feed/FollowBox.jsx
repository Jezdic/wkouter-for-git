import { useContext, useState } from "react";
import UserContext from "../../UserContext";

import FollowingList from "./FollowingList";

import { AiOutlinePlusCircle } from "react-icons/ai";

import styles from "../../sass/feed/followBox.module.scss";

const FollowBox = () => {
  const { setUser, user } = useContext(UserContext);
  const [displayFollowing, setDisplayFollowing] = useState(false);
  const [followUsername, setFollowUsername] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState("");

  const handleFollow = async () => {
    try {
      if (user.following.some((u) => u.username === followUsername))
        return setFail("user already followed");
      if (followUsername === user.username)
        return setFail("you cannot follow yourself");
      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/users/followUser/${followUsername}`,
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
        setSuccess(true);
        setFollowUsername("");
      } else {
        setFail(data.message.toLowerCase());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setSuccess(false);
        setFail("");
      }, 2000);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleFollow();
  };

  return (
    <div className={styles.container}>
      <div className={styles.addContainer}>
        <span>follow a user</span>
        <div className={styles.searchBox}>
          <input
            placeholder='Username'
            value={followUsername}
            onChange={(e) => setFollowUsername(e.target.value)}
            onKeyDown={handleKey}
          />
          <div className={`${styles.success} ${styles.status}`}>
            {success && "user followed"}
          </div>
          <div className={`${styles.fail} ${styles.status}`}>{fail}</div>
          <AiOutlinePlusCircle onClick={handleFollow} />
        </div>
      </div>
      <div className={styles.followingCount}>
        <span>currently following</span>
        <h1>{user.following.length}</h1>
        <span>{user.following.length > 1 ? "people" : "person"}</span>
        <button
          className={styles.btn}
          onClick={() => setDisplayFollowing(!displayFollowing)}
        >
          view list
        </button>
      </div>
      <FollowingList
        toggle={displayFollowing}
        setToggle={setDisplayFollowing}
      />
    </div>
  );
};

export default FollowBox;
