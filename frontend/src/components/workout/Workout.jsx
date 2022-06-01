import { useState, useEffect } from "react";
import Exercises from "./Exercises";

import styles from "../../sass/workout.module.scss";

const Workout = ({ data, toggleEdit, setEditingWorkout, setWorkouts }) => {
  const [workout, setWorkout] = useState(data);

  useEffect(() => {
    setWorkout(data);
  }, [data]);

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
        setWorkouts((w) => w.filter((cur) => cur._id !== workout._id));
    } catch (err) {
      alert("Something went wrong..");
    }
  };

  const handleEdit = () => {
    setEditingWorkout(workout);
    setTimeout(() => toggleEdit(true), 0);
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
        setWorkouts((w) => [data.data.workout, ...w]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <FaRegClone size={14} className={styles.icon} onClick={handleClone} />
        <BiEditAlt onClick={handleEdit} className={styles.icon} />
        <AiOutlineDelete className={styles.icon} onClick={handleDelete} />
      </div>
      <div className={styles.header}>
        <h1>{workout.title}</h1>
        <span className={styles.date}>
          {new Date(workout.plannedDate).toLocaleDateString("sr")}
        </span>
      </div>
      <div className={styles.notes}>{workout.notes}</div>
      <div className={styles.exercises}>
        <Exercises data={workout.exercisesPlanned} />
      </div>
    </div>
  );
};

export default Workout;
