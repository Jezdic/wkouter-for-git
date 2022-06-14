import { useState, useEffect } from "react";

import { AiOutlineHeart, AiFillHeart, AiOutlineClose } from "react-icons/ai";

import { BeatLoader } from "react-spinners";

import styles from "../../sass/profile/commentPreview.module.scss";

const CommentPreview = ({ setDisplayCommentPreview, commentId, replyId }) => {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState();
  const [reply, setReply] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const { photo, username } = JSON.parse(localStorage.getItem("user"));

  const handlePostReply = () => {
    //post reply to commentId and change ui
  };

  const handleLikeComment = async () => {
    const urlString = replyId
      ? `likeReply/${replyId}`
      : `likeComment/${commentId}`;

    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/comments/${urlString}`,
      {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const { likeStatus } = await req.json();
    setIsLiked(likeStatus);
  };

  const fetchComment = async () => {
    const queryString = commentId
      ? `commentId=${commentId}`
      : `replyId=${replyId}`;

    try {
      const req = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/comments/commentPreview?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const { status, preview } = await req.json();
      if (status === "success") {
        setPreview(preview);
        setIsLiked(preview.likes.includes(username));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(fetchComment, []);

  if (loading)
    return (
      <div style={{ padding: "0.5rem 2rem" }}>
        <BeatLoader color='#0dbacc' />
      </div>
    );

  return (
    <div className={styles.container}>
      <AiOutlineClose
        className={styles.closeBtn}
        onClick={() => setDisplayCommentPreview(false)}
      />
      <div>
        <div>{preview.comment}</div>
        <div onClick={handleLikeComment} className={styles.actionBtn}>
          {isLiked ? <AiFillHeart size={15} /> : <AiOutlineHeart size={15} />}
        </div>
      </div>
      <form onSubmit={handlePostReply} className={styles.commentForm}>
        <img
          alt='user'
          src={`${import.meta.env.VITE_STATIC_URL}/img/users/${photo}`}
        />
        <input
          value={reply}
          placeholder='write a reply'
          className={styles.commentInput}
          onChange={(e) => setReply(e.target.value)}
        />
      </form>
    </div>
  );
};

export default CommentPreview;
