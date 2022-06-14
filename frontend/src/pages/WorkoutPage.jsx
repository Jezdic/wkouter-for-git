import { useState, useEffect, useContext } from "react";

import UserContext from "../UserContext";

import { useParams, Navigate } from "react-router-dom";

import UserWorkout from "../components/workout/UserWorkout";

import { PulseLoader } from "react-spinners";

const WorkoutPage = () => {
  const { workoutId } = useParams();
  const { user } = useContext(UserContext);
  const [workout, setWorkout] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchWorkout = async () => {
    try {
      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/workouts/${workoutId}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const res = await req.json();
      if (res.status === "success") {
        setWorkout(res.data.workout);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(fetchWorkout, [workoutId]);

  if (loading)
    return (
      <div style={{ marginTop: "15rem" }}>
        <PulseLoader size={25} color='#0dbacc' />
      </div>
    );

  return (
    <UserWorkout
      initWorkout={workout}
      key={workout._id}
      type='feed'
      myUsername={user.username}
      myPhoto={user.photo}
    />
  );
};

export default WorkoutPage;
