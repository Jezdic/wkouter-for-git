import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import { PulseLoader } from "react-spinners";

import UserDetails from "../components/feed/UserDetails";

import { ImSad } from "react-icons/im";

import styles from "../sass/profile/userProfile.module.scss";
import WorkoutPreview from "../components/profile/WorkoutPreview";

const checkFollowingUser = (username, following) =>
  following.some((user) => user.username === username);

const UserProfile = () => {
  const { username } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const {
    photo: myPhoto,
    username: myUsername,
    following,
  } = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    (async () => {
      try {
        const options = {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        };

        const workReq = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/workouts/user/${username}?sort=-createdAt`,
          options
        );
        const workRes = await workReq.json();

        const userReq = await fetch(
          `${import.meta.env.VITE_API_URL}/users/getUserDetails/${username}`,
          options
        );
        const userRes = await userReq.json();

        setUser(userRes.user);
        setWorkouts(workRes.data.workouts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (user.username === myUsername) return <Navigate to='/home' />;

  return (
    <div className={styles.container}>
      {loading ? (
        <PulseLoader color='#0dbacc' />
      ) : (
        <>
          <UserDetails
            user={user}
            workoutCount={workouts.length}
            followStatus={checkFollowingUser(username, following)}
          />
          {workouts.length > 0 ? (
            <div className={styles.workoutsGrid}>
              {workouts.map((wr) => (
                <WorkoutPreview workout={wr} key={wr._id} />
              ))}
            </div>
          ) : (
            <div className={styles.noWorkouts}>user has no workouts yet</div>
          )}
        </>
      )}
    </div>
  );
};

export default UserProfile;
