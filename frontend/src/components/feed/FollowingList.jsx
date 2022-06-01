import { useContext } from "react";
import UserContext from "../../UserContext";
import useEscape from "../../utils/useEscape";

import { animated, useTransition } from "react-spring";

import { AiOutlineMinusCircle } from "react-icons/ai";

import styles from "../../sass/feed/followingList.module.scss";

import FollowedUser from "./FollowedUser";

const options = {
  from: { y: -1000, zIndex: 100 },
  enter: { y: 0 },
  leave: { y: 1000, zIndex: 100 },
};

const FollowingList = ({ toggle, setToggle }) => {
  const transitions = useTransition(toggle, options);
  const { user, setUser } = useContext(UserContext);

  useEscape(setToggle);

  return transitions(
    (animationStyles, item) =>
      item && (
        <animated.div className={styles.container} style={animationStyles}>
          <AiOutlineMinusCircle
            size={20}
            className={styles.exitBtn}
            onClick={() => setToggle(false)}
          />
          <h1 className={styles.heading}>Following</h1>
          {user.following.length === 0
            ? "You don't follow anyone yet"
            : user.following.map((us) => (
                <FollowedUser user={us} setUser={setUser} key={us.username} />
              ))}
        </animated.div>
      )
  );
};

export default FollowingList;
