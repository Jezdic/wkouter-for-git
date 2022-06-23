import { animated, useTransition } from "react-spring";
import { useState, useEffect } from "react";

import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate, MdOutlineCancel } from "react-icons/md";

import { BeatLoader } from "react-spinners";

import InputExercise from "./InputExercise";

import useEscape from "../../utils/useEscape";

import styles from "../../sass/user/createWorkout.module.scss";
import initExercise from "../../utils/initExercise";

const options = {
  from: { x: -100, zIndex: 100, opacity: 0 },
  enter: { x: 0, opacity: 1 },
  leave: { x: 100, zIndex: -100, opacity: 0 },
};

const CreateWorkout = ({ toggle, setToggle, setWorkouts }) => {
  const transitions = useTransition(toggle, options);
  const [exercisesPlanned, setExercisesPlanned] = useState([initExercise()]);
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState({
    title: "",
    exercisesPlanned,
    notes: "",
    plannedDate: "",
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setWorkout((work) => ({ ...work, exercisesPlanned }));
  }, [exercisesPlanned]);

  useEffect(() => {
    if (!selectedPhoto) return setPreview(undefined);

    const objectUrl = URL.createObjectURL(selectedPhoto);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0)
      return setSelectedPhoto(undefined);

    setSelectedPhoto(e.target.files[0]);
  };

  const generateFormData = () => {
    let form = new FormData();
    form.append("photo", selectedPhoto);
    form.append("title", workout.title);
    form.append("exercisesPlanned", JSON.stringify(workout.exercisesPlanned));
    form.append("notes", workout.notes);
    form.append("plannedDate", workout.plannedDate);
    console.log(form);
    return form;
  };

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

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/workouts`, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
        },
        body: generateFormData(),
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.status === "success") {
        setWorkouts((w) => [data.data.workout, ...w]);
        setToggle(false);
        setExercisesPlanned([initExercise()]);
        setWorkout({
          title: "",
          exercisesPlanned,
          notes: "",
          plannedDate: "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((w) => ({ ...w, [name]: value }));
  };

  return transitions(
    (animationStyles, item) =>
      item && (
        <animated.div className={styles.container} style={animationStyles}>
          <div className={styles.exitBtn}>
            esc
            <AiOutlineMinusCircle size={20} onClick={() => setToggle(false)} />
          </div>
          <form className={styles.form}>
            <label htmlFor='title'>title</label>
            <input name='title' type='text' onChange={handleChange}></input>
            <label htmlFor='plannedDate'>planned date</label>
            <input
              name='plannedDate'
              type='date'
              onChange={handleChange}
            ></input>
            <label htmlFor='notes'>notes</label>
            <textarea
              className={styles.notes}
              name='notes'
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
          {selectedPhoto ? (
            <div className={styles.photoContainer}>
              <img
                className={styles.photoPreview}
                src={preview}
                alt='preview'
              />
              <MdOutlineCancel
                size={20}
                className={styles.photoCancel}
                onClick={() => setSelectedPhoto(null)}
              />
            </div>
          ) : (
            <label>
              <div className={styles.photoUpload}>
                <div>
                  <MdOutlineAddPhotoAlternate size={40} />
                  <span>add photo</span>
                </div>
              </div>
              <input
                type='file'
                className={styles.photoInput}
                onChange={onSelectFile}
              />
            </label>
          )}
          <button className={styles.saveBtn} onClick={handleSave}>
            {loading ? <BeatLoader size={10} /> : "save"}
          </button>
        </animated.div>
      )
  );
};

export default CreateWorkout;
