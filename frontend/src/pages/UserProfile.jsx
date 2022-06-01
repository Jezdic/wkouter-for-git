import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import { PulseLoader } from "react-spinners";

import UserWorkout from "../components/workout/UserWorkout";
import UserDetails from "../components/feed/UserDetails";

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const UserProfile = () => {
  const { username } = useParams();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const { photo: myPhoto, username: myUsername } = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    (async () => {
      try {
        const options = {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        };

        const workReq = await fetch(
          `${import.meta.env.VITE_API_URL}/workouts/user/${username}`,
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
    <div style={style}>
      {loading ? (
        <PulseLoader color='#0dbacc' />
      ) : (
        <>
          <UserDetails user={user} workoutCount={workouts.length} />
          <div>
            {workouts.map((wr) => (
              <UserWorkout
                initWorkout={wr}
                key={wr.title}
                myUsername={myUsername}
                myPhoto={myPhoto}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
