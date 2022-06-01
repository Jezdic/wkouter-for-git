import React from "react";

const styles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
  gap: "2rem",
  marginTop: "2rem",
  color: "white",
};

const FirstWorkout = () => {
  return (
    <div style={styles}>
      <p>no workouts yet</p>
      <p>create your first workout to get started</p>
    </div>
  );
};

export default FirstWorkout;
