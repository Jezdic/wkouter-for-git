import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import Exercises from "./Exercises";

import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";

import styles from "../../sass/feed/userWorkout.module.scss";
import Comments from "./Comments";

const UserWorkout = ({ initWorkout, type, myUsername, myPhoto }) => {
  const [workout, setWorkout] = useState(initWorkout);
  const [isLiked, setIsLiked] = useState(workout.likes.includes(myUsername));
  const [likesNum, setLikesNum] = useState(workout.likes.length);

  const [showComments, setShowComments] = useState(false);
  const [numComments, setNumComments] = useState(workout.numComments);
  const [totalComments, setTotalComments] = useState(
    workout.numComments + workout.numReplies
  );
  const [comments, setComments] = useState([]);
  const [initComments, setInitComments] = useState(true);

  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsPerPage = 3;

  const { username, photo } = workout.user;

  const likeWorkout = async () => {
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/workouts/likeWorkout/${workout.id}`,
      {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const { likeStatus } = await req.json();
    likeStatus ? setLikesNum((num) => num + 1) : setLikesNum((num) => num - 1);
    setIsLiked(likeStatus);
  };

  useEffect(() => {
    if (showComments && initComments) {
      loadComments();
      setInitComments(false);
    }
  }, [showComments]);

  const loadComments = async (commentsPage = 1) => {
    try {
      setLoadingComments(true);
      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/comments/${
          workout.id
        }?page=${commentsPage}&limit=${commentsPerPage}&sort=-createdAt`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const res = await req.json();
      if (res.status === "success") {
        setComments((comms) => [...comms, ...res.comments]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <div
      className={`${styles.container} ${
        type === "feed" && styles.containerFeed
      }`}
    >
      {type === "feed" && (
        <div className={styles.userInfo}>
          <img
            src={`${import.meta.env.VITE_STATIC_URL}/img/users/${photo}`}
            alt='user'
          />
          <Link className={styles.userLink} to={`/home/user/${username}`}>
            {username}
          </Link>
        </div>
      )}
      <div className={styles[`header-${type}`]}>
        <h1 className={styles.title}>{workout.title}</h1>
        {new Date(workout.plannedDate).toLocaleDateString("sr")}
      </div>
      <img loading='lazy' className={styles.workoutImg} src={workout.photo} />
      <div className={styles.notes}>{workout.notes}</div>
      <div className={styles.exercises}>
        <Exercises data={workout.exercisesPlanned} />
      </div>
      <div className={styles.likesAndComments}>
        <div onClick={likeWorkout} className={styles.actionBtn}>
          {isLiked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
          {likesNum}
        </div>
        <div
          className={styles.actionBtn}
          onClick={() => setShowComments(!showComments)}
        >
          <AiOutlineComment size={20} />
          {totalComments}
        </div>
      </div>
      {showComments && (
        <Comments
          comments={comments}
          setComments={setComments}
          loadingComments={loadingComments}
          myPhoto={myPhoto}
          myUsername={myUsername}
          setTotalComments={setTotalComments}
          workoutId={workout.id}
          loadComments={loadComments}
          numComments={numComments}
        />
      )}
    </div>
  );
};

export default UserWorkout;
