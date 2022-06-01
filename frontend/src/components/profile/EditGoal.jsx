import { useState, useContext } from "react";
import UserContext from "../../UserContext";

import styles from "../../sass/user/editGoal.module.scss";

const EditGoal = () => {
  const { user, setUser } = useContext(UserContext);
  const [goals, setGoals] = useState(user.goals);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);

  const handleSubmit = async () => {
    try {
      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/users/updateMe`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ goals }),
        }
      );
      const res = await req.json();
      if (res.status === "success") {
        setUser(res.data.user);
        setShowUpdateBtn(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setGoals(value);
    if (value !== user.goals) setShowUpdateBtn(true);
    else setShowUpdateBtn(false);
  };

  return (
    <>
      <textarea
        type='text'
        value={goals}
        placeholder='my goals are...'
        onChange={handleChange}
        className={styles.input}
      ></textarea>
      {showUpdateBtn && (
        <button onClick={handleSubmit} className={styles.btn}>
          update
        </button>
      )}
    </>
  );
};

export default EditGoal;
