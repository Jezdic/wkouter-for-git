import Header from "../components/Header";
import styles from "../sass/home.module.scss";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AccountSettings from "../components/profile/AccountSettings";

const Home = () => {
  const [userAccountMenu, setUserAccountMenu] = useState(false);

  return (
    <div className={styles.centered}>
      <div className={styles.container}>
        <Header setUserAccountMenu={setUserAccountMenu} />
        <main>
          <AccountSettings
            toggle={userAccountMenu}
            setToggle={setUserAccountMenu}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
