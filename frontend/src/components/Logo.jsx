import { FaRunning } from "react-icons/fa";

import styles from "../sass/logo.module.scss";

const Logo = ({ type }) => {
  const size = type === "header" ? 70 : 30;

  return (
    <div className={styles.logo}>
      <FaRunning size={size} />
      <span className={styles[`text--${type}`]}>workouter</span>
    </div>
  );
};

export default Logo;
