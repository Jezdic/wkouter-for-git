import styles from "../../sass/profile/workoutPreview.module.scss";

import { Link } from "react-router-dom";

import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

const WorkoutPreview = ({
  workout: { photo, likes, numComments, numReplies, _id },
}) => {
  return (
    <Link to={`/home/workout/${_id}`}>
      <div className={styles.container}>
        <div className={styles.stats}>
          <div>
            <AiFillHeart size={30} />
            {likes.length}
          </div>
          <div>
            <FaComment size={30} />
            {numComments + numReplies}
          </div>
        </div>
        <img src={photo} className={styles.img} />
      </div>
    </Link>
  );
};

export default WorkoutPreview;
