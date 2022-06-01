import { useState } from "react";

import Reply from "./Reply";

import styles from "./../../sass/workout/replies.module.scss";

const Replies = ({
  myPhoto,
  myUsername,
  replies,
  setReplies,
  commentId,
  setTotalComments,
}) => {
  const [reply, setReply] = useState("");

  const handlePostReply = async (e) => {
    e.preventDefault();

    await fetch(
      `${import.meta.env.VITE_API_URL}/comments/replies/${commentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          comment: reply,
        }),
      }
    );
    setReplies((reps) => [
      ...reps,
      {
        comment: reply,
        createdAt: Date.now(),
        user: { username: myUsername, photo: myPhoto },
        likes: [],
      },
    ]);
    setReply("");
    setTotalComments((num) => ++num);
  };

  return (
    <div className={styles.container}>
      {replies.map((reply) => (
        <Reply reply={reply} myUsername={myUsername} key={reply._id} />
      ))}
      <form onSubmit={handlePostReply} className={styles.form}>
        <img
          alt='user'
          className={styles.imgtest}
          src={`${import.meta.env.VITE_STATIC_URL}/img/users/${myPhoto}`}
        />
        <input
          className={styles.replyInput}
          value={reply}
          placeholder='write a reply'
          onChange={(e) => setReply(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Replies;
