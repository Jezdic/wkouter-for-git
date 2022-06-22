import Header from "../components/Header";
import styles from "../sass/home.module.scss";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AccountSettings from "../components/profile/AccountSettings";

const Home = () => {
  const [userAccountMenu, setUserAccountMenu] = useState(false);

  return (
    <div className={styles.centered}>
      <Header setUserAccountMenu={setUserAccountMenu} />
      <main style={{ marginTop: "8rem" }}>
        <AccountSettings
          toggle={userAccountMenu}
          setToggle={setUserAccountMenu}
        />
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
