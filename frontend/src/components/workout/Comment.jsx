import { useState } from "react";

import { Link } from "react-router-dom";

import ReactTimeAgo from "react-time-ago";

import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { BsArrowReturnRight } from "react-icons/bs";

import styles from "../../sass/workout/comments.module.scss";
import Replies from "./Replies";

import { PulseLoader } from "react-spinners";

const Comment = ({ comment, myUsername, myPhoto, setTotalComments }) => {
  const [isLiked, setIsLiked] = useState(comment.likes.includes(myUsername));
  const [likesNum, setLikesNum] = useState(comment.likes.length);

  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showRepliesBtn, setShowRepliesBtn] = useState(comment.numReplies > 0);

  const loadReplies = async () => {
    setLoadingReplies(true);
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/comments/replies/${comment._id}`,
      {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const res = await req.json();
    setReplies(res.replies);
    setLoadingReplies(false);
    setShowReplies(true);
    setShowRepliesBtn(false);
  };

  const handleLike = async () => {
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/comments/likeComment/${comment._id}`,
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

  return (
    <div>
      <div key={comment.createdAt} className={styles.comment}>
        <div className={styles.commentHeader}>
          <Link to={`/home/user/${comment.user.username}`}>
            <div className={styles.commentAuthor}>
              <img
                src={`${import.meta.env.VITE_STATIC_URL}/img/users/${
                  comment.user.photo
                }`}
              />
              <span>{comment.user.username}</span>
            </div>
          </Link>
          <span>
            <ReactTimeAgo
              date={comment.createdAt}
              timeStyle='minute-now'
              locale='en-US'
            />
          </span>
        </div>
        {comment.comment}
        <div className={styles.likesAndReplies}>
          <div onClick={handleLike} className={styles.actionBtn}>
            {isLiked ? <AiFillHeart size={15} /> : <AiOutlineHeart size={15} />}
            {likesNum}
          </div>
          <span
            className={styles.replyBtn}
            onClick={() => {
              setShowRepliesBtn(false);
              setShowReplies(true);
            }}
          >
            reply
          </span>
        </div>
      </div>
      {showRepliesBtn && comment.numReplies > 0 && (
        <div className={styles.repliesBtn} onClick={loadReplies}>
          <BsArrowReturnRight /> {comment.numReplies}{" "}
          {comment.numReplies > 1 ? "replies" : "reply"}
        </div>
      )}
      {loadingReplies && <PulseLoader color='#0dbacc' />}
      {showReplies && (
        <Replies
          myPhoto={myPhoto}
          myUsername={myUsername}
          replies={replies}
          setReplies={setReplies}
          commentId={comment._id}
          setTotalComments={setTotalComments}
        />
      )}
    </div>
  );
};

export default Comment;
