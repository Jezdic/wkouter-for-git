import { useState } from "react";

import Comment from "./Comment";

import { PulseLoader } from "react-spinners";

import styles from "../../sass/workout/comments.module.scss";

const Comments = ({
  comments,
  setComments,
  numComments,
  loadingComments,
  myPhoto,
  myUsername,
  workoutId,
  loadComments,
  setTotalComments,
}) => {
  const [comment, setComment] = useState("");
  const [commentPage, setCommentPage] = useState(2);

  const addComment = async (e) => {
    e.preventDefault();

    await fetch(`${import.meta.env.VITE_API_URL}/comments/${workoutId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        comment,
      }),
    });
    setComments((comms) => [
      {
        comment,
        createdAt: Date.now(),
        user: { username: myUsername, photo: myPhoto },
        likes: [],
        numReplies: 0,
      },
      ...comms,
    ]);
    setComment("");
    setTotalComments((num) => ++num);
    setNumComments((num) => ++num);
  };

  const handleLoadComments = () => {
    loadComments(commentPage);
    setCommentPage(commentPage + 1);
  };

  return (
    <div className={styles.comments}>
      <form onSubmit={addComment} className={styles.commentForm}>
        <img
          alt='user'
          src={`${import.meta.env.VITE_STATIC_URL}/img/users/${myPhoto}`}
        />
        <input
          value={comment}
          placeholder='write a comment'
          className={styles.commentInput}
          onChange={(e) => setComment(e.target.value)}
        />
      </form>
      {comments.map((comment) => (
        <Comment
          comment={comment}
          setTotalComments={setTotalComments}
          myPhoto={myPhoto}
          myUsername={myUsername}
        />
      ))}
      <div className={styles.loadSection}>
        {numComments > comments.length && (
          <span className={styles.loadBtn} onClick={handleLoadComments}>
            load more
          </span>
        )}
        {comments.length !== numComments && comments.length < numComments && (
          <span>
            {comments.length} of {numComments}
          </span>
        )}
      </div>
      {loadingComments && <PulseLoader color='#0dbacc' />}
    </div>
  );
};

export default Comments;
