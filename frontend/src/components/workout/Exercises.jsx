const Exercise = ({ exercise, num }) => {
  return (
    <div>
      {num}. {exercise.name} : {exercise.sets} set{exercise.sets > 1 && "s"}{" "}
      {exercise.reps} rep{exercise.reps > 1 && "s"}
      {+exercise.weight > 0 ? ` ${exercise.weight}kg` : ""}
    </div>
  );
};

const Exercises = ({ data }) => {
  return (
    <>
      {data.map((ex, i) => (
        <Exercise key={i} exercise={ex} num={i + 1} />
      ))}
    </>
  );
};

export default Exercises;
