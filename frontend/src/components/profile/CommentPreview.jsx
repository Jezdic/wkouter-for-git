import { useState, useEffect } from "react";

import { BeatLoader } from "react-spinners";

import styles from "../../sass/profile/commentPreview.module.scss";

const CommentPreview = ({ setDisplayCommentPreview, commentId, replyId }) => {
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState();

  useEffect(() => {
    //fetch comment or reply and set it
    //set loading false
  }, []);

  if (loading)
    return (
      <div style={{ marginLeft: "2rem" }}>
        <BeatLoader color='#0dbacc' />
      </div>
    );

  return <div className={styles.container}></div>;
};

export default CommentPreview;
