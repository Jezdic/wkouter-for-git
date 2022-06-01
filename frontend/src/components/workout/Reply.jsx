import { useState } from "react";

import ReactTimeAgo from "react-time-ago";

import { Link } from "react-router-dom";

import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";

import styles from "../../sass/workout/reply.module.scss";

const Reply = ({ reply, myUsername }) => {
  const [isLiked, setIsLiked] = useState(reply.likes.includes(myUsername));
  const [likesNum, setLikesNum] = useState(reply.likes.length);

  const handleLike = async () => {
    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/comments/likeReply/${reply._id}`,
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
      <div key={reply.createdAt} className={styles.reply}>
        <div className={styles.replyHeader}>
          <Link to={`/home/user/${reply.user.username}`}>
            <div className={styles.replyAuthor}>
              <img
                src={`${import.meta.env.VITE_STATIC_URL}/img/users/${
                  reply.user.photo
                }`}
              />
              <span>{reply.user.username}</span>
            </div>
          </Link>
          <span>
            <ReactTimeAgo
              date={reply.createdAt}
              timeStyle='minute-now'
              locale='en-US'
            />
          </span>
        </div>
        {reply.comment}
        <div className={styles.likesAndReplies}>
          <div onClick={handleLike} className={styles.actionBtn}>
            {isLiked ? <AiFillHeart size={15} /> : <AiOutlineHeart size={15} />}
            {likesNum}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reply;
