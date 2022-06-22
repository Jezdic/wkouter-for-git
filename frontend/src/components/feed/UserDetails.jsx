import styles from "../../sass/profile/userDetails.module.scss";
import { GiStairsGoal } from "react-icons/gi";
import { BiTime, BiUserCheck } from "react-icons/bi";
import EditGoal from "../profile/EditGoal";

const UserDetails = ({ user, workoutCount, isLoggedInUser, followStatus }) => {
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
          {followStatus ? (
            <button>
              <BiUserCheck style={{ display: "block" }} size={27} />
            </button>
          ) : (
            <button>follow</button>
          )}
        </div>
        <div className={styles.stats}>
          <div>
            <span>{workoutCount}</span> workouts
          </div>
          <div>
            <span>10</span> followers
          </div>
          <div>
            <span>9</span> following
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
