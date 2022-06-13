import { useParams, Navigate } from "react-router-dom";

const WorkoutPage = () => {
  const { workoutId } = useParams();

  return <div>WorkoutPage, {workoutId}</div>;
};

export default WorkoutPage;
