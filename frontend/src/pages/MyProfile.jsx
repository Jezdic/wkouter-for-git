import { useEffect, useState, useContext } from "react";

import WorkoutPreview from "../components/profile/WorkoutPreview";

import { PulseLoader } from "react-spinners";
import { AiOutlinePlusCircle } from "react-icons/ai";
import styles from "../sass/user/myProfile.module.scss";

import UserContext from "../UserContext";

import UserDetails from "../components/feed/UserDetails";
import FirstWorkout from "../components/profile/FirstWorkout";
import CreateWorkout from "../components/workout/CreateWorkout";
import EditWorkout from "../components/workout/EditWorkout";

const MyProfile = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWorkoutMenu, setNewWorkoutMenu] = useState(false);
  const [editWorkoutMenu, setEditWorkoutMenu] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState({});
  const { user } = useContext(UserContext);

  console.log({ user });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/workouts?sort=-createdAt`,
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
        const data = await res.json();
        setWorkouts(data.data.workouts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {loading ? (
        <PulseLoader color='#0dbacc' />
      ) : (
        <>
          <CreateWorkout
            setWorkouts={setWorkouts}
            toggle={newWorkoutMenu}
            setToggle={setNewWorkoutMenu}
          />
          <EditWorkout
            setWorkouts={setWorkouts}
            toggle={editWorkoutMenu}
            setToggle={setEditWorkoutMenu}
            editingWorkout={editingWorkout}
            workouts={workouts}
          />
          <UserDetails
            user={user}
            workoutCount={workouts.length}
            isLoggedInUser={true}
          />
          <div className={styles.createBtn}>
            <AiOutlinePlusCircle
              size={40}
              className={styles.addBtn}
              onClick={() => setNewWorkoutMenu(!newWorkoutMenu)}
            />
            <span>create workout</span>
          </div>
          {workouts.length === 0 && <FirstWorkout />}
          <div className={styles.workoutsGrid}>
            {workouts.map((workout) => (
              <WorkoutPreview workout={workout} key={workout._id} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MyProfile;
