import { MdOutlineCancel } from "react-icons/md";
import styles from "../../sass/user/inputExercise.module.scss";

const InputExercise = ({
  keyId,
  handleChange,
  removeHandler,
  exercise,
  num,
}) => {
  const init = exercise || { name: "", sets: "", reps: "", weight: "" };

  return (
    <div className={styles.editContainer}>
      <div className={styles.exerciseEdit}>
        {num}-
        <input
          className={styles.editName}
          placeholder='name'
          name='name'
          onChange={handleChange}
          data-id={keyId}
          defaultValue={init.name}
        />
        <input
          className={styles.editNum}
          placeholder='sets'
          type='number'
          name='sets'
          onChange={handleChange}
          data-id={keyId}
          defaultValue={init.sets}
        />
        <input
          className={styles.editNum}
          placeholder='reps'
          onChange={handleChange}
          name='reps'
          type='number'
          data-id={keyId}
          defaultValue={init.reps}
        />
        <input
          className={styles.editNum}
          placeholder='kg'
          name='weight'
          type='number'
          onChange={handleChange}
          data-id={keyId}
          defaultValue={init.weight}
        />
        <MdOutlineCancel onClick={removeHandler} className={styles.deleteBtn} />
      </div>
    </div>
  );
};

export default InputExercise;
