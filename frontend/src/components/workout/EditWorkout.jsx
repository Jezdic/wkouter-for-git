import { animated, useTransition } from "react-spring";
import { useState, useEffect, useReducer } from "react";

import useEscape from "../../utils/useEscape";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { BeatLoader } from "react-spinners";

import InputExercise from "./InputExercise";

import styles from "../../sass/user/editWorkout.module.scss";
import initExercise from "../../utils/initExercise";

const options = {
  from: { scale: 0.85, zIndex: 100, opacity: 0 },
  enter: { scale: 1, opacity: 1, zIndex: 100 },
  leave: { scale: 1.1, zIndex: -100, opacity: 0 },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "update_input":
      return { ...state, [action.key]: action.value };
    case "update_exercises":
      return { ...state, exercisesPlanned: action.value };
    case "update_workout":
      return action.value;
    default:
      return state;
  }
};

const EditWorkout = ({ toggle, setToggle, editingWorkout, setWorkouts }) => {
  const transitions = useTransition(toggle, options);
  const [exercisesPlanned, setExercisesPlanned] = useState(
    editingWorkout.exercisesPlanned
  );
  const [loading, setLoading] = useState(false);
  const [workout, dispatch] = useReducer(reducer, editingWorkout);

  useEffect(() => {
    setExercisesPlanned(editingWorkout.exercisesPlanned);
    dispatch({ type: "update_workout", value: editingWorkout });
  }, [editingWorkout]);

  useEffect(() => {
    dispatch({ type: "update_exercises", value: exercisesPlanned });
  }, [exercisesPlanned]);

  useEscape(setToggle);

  const handleChangeExercise = (e) => {
    const { name, value } = e.target;
    setExercisesPlanned((exs) =>
      exs.map((curr) =>
        curr.id === e.target.dataset.id
          ? {
              ...curr,
              [name]: value,
            }
          : curr
      )
    );
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/workouts/${workout._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(workout),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setToggle(false);
        setWorkouts((w) => [
          ...w.map((cur) => (cur._id === workout._id ? workout : cur)),
        ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "update_input", key: name, value });
  };

  return transitions(
    (animationStyles, item) =>
      item && (
        <animated.div className={styles.container} style={animationStyles}>
          <AiOutlineMinusCircle
            size={20}
            className={styles.exitBtn}
            onClick={() => setToggle(false)}
          />
          <form className={styles.form}>
            <label htmlFor='title'>title</label>
            <input
              name='title'
              type='text'
              value={workout.title}
              onChange={handleChange}
            ></input>
            <label htmlFor='plannedDate'>planned date</label>
            <input
              name='plannedDate'
              type='date'
              value={new Date(workout.plannedDate).toISOString().substr(0, 10)}
              onChange={handleChange}
            ></input>
            <label htmlFor='notes'>notes</label>
            <textarea
              className={styles.notes}
              name='notes'
              value={workout.notes}
              onChange={handleChange}
            ></textarea>
            exercises
          </form>
          {exercisesPlanned.map((ex, i) => (
            <InputExercise
              key={ex.id}
              keyId={ex.id}
              num={i + 1}
              removeHandler={() =>
                setExercisesPlanned((exs) =>
                  exs.filter((cur) => cur.id !== ex.id)
                )
              }
              exercise={ex}
              handleChange={handleChangeExercise}
            />
          ))}
          <div
            className={styles.addEx}
            onClick={() => setExercisesPlanned((ex) => [...ex, initExercise()])}
          >
            <AiOutlinePlusCircle size={20} />
            add Exercise
          </div>
          <button className={styles.saveBtn} onClick={handleEdit}>
            {loading ? <BeatLoader size={10} /> : "edit"}
          </button>
        </animated.div>
      )
  );
};

export default EditWorkout;
