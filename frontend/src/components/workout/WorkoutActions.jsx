import styles from "../../sass/user/workoutActions.module.scss";

import { AiOutlineDelete } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { FaRegClone } from "react-icons/fa";

const WorkoutActions = ({ editProps, workout }) => {
  const handleEdit = () => {
    editProps.setEditingWorkout(workout);
    setTimeout(() => editProps.setEditWorkoutMenu(true), 0);
  };

  const handleClone = async () => {
    const { exercisesPlanned, notes, plannedDate, title } = workout;
    const clonedWorkout = { exercisesPlanned, notes, plannedDate, title };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(clonedWorkout),
      });
      const data = await res.json();
      if (data.status === "success") {
        editProps.setWorkouts((w) => [data.data.workout, ...w]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/workouts/${workout._id}`,
        {
          method: "DELETE",
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      if (res.status === 204)
        editProps.setWorkouts((w) =>
          w.filter((cur) => cur._id !== workout._id)
        );
    } catch (err) {
      alert("Something went wrong..");
    }
  };

  return (
    <div>
      <div className={styles.actions}>
        <FaRegClone size={14} className={styles.icon} onClick={handleClone} />
        <BiEditAlt onClick={handleEdit} className={styles.icon} />
        <AiOutlineDelete className={styles.icon} onClick={handleDelete} />
      </div>
    </div>
  );
};

export default WorkoutActions;
