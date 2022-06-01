import { uniqueId } from "lodash";

const initExercise = () => ({
  name: "",
  sets: "",
  reps: "",
  weight: "",
  id: uniqueId(Date.now()),
});

export default initExercise;
