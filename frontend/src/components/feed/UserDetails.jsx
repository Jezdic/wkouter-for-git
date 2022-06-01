import styles from "../../sass/profile/userDetails.module.scss";
import { GiStairsGoal, GiWeightLiftingUp } from "react-icons/gi";
import { BiTime } from "react-icons/bi";
import EditGoal from "../profile/EditGoal";

const UserDetails = ({ user, workoutCount, isLoggedInUser }) => {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <img
          alt='user'
          src={`${import.meta.env.VITE_STATIC_URL}/img/users/${user.photo}`}
        />
        <span>{user.username}</span>
      </div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.centered}>
            <GiWeightLiftingUp />
            <span>{workoutCount} workouts</span>
          </div>
          <span className={styles.centered}>
            <BiTime /> workouter since{"  "}
            {new Date(user.joinedSince).toLocaleDateString("en-us")}
          </span>
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
