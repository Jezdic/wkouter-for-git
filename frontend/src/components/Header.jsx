import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { animated, useTransition } from "react-spring";

import UserContext from "../UserContext";
import Logo from "./Logo";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";

import Notifications from "./profile/Notifications";

import styles from "../sass/header.module.scss";

const options = {
  from: { x: 100, zIndex: 100, opacity: 0 },
  enter: { x: 0, opacity: 1 },
  leave: { x: 100, zIndex: -100, opacity: 0 },
};

const Header = ({ setUserAccountMenu }) => {
  const { user } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const transitions = useTransition(showMenu, options);

  const [showNotifs, setShowNotifs] = useState(false);
  const [newNotifsCounter, setNewNotifsCounter] = useState(0);

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Logo type={"nav"} />
          <div className={styles.menu}>
            <div className={styles.userIcon} onClick={() => navigate("/home")}>
              <img
                src={`${import.meta.env.VITE_STATIC_URL}/img/users/${
                  user.photo
                }`}
                alt='user'
              ></img>
              <span>{user.username}</span>
            </div>
            <div style={{ position: "relative" }}>
              {showNotifs ? (
                <AiOutlineClose
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNotifs(false)}
                  size={30}
                />
              ) : (
                <IoMdNotificationsOutline
                  size={30}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNotifs(true)}
                />
              )}
              {newNotifsCounter > 0 && (
                <div className={styles.newNotifsCounter}>
                  {newNotifsCounter}
                </div>
              )}
              <Notifications
                toggle={showNotifs}
                setNewNotifsCounter={setNewNotifsCounter}
                setToggle={setShowNotifs}
              />
            </div>
            {location.pathname === "/home/feed" ? (
              <Link to='' className={styles.btn}>
                my profile
              </Link>
            ) : (
              <Link to='feed' className={styles.btn}>
                feed
              </Link>
            )}
            <button onClick={() => setUserAccountMenu(true)}>
              account settings
            </button>
            <button onClick={logout}>logout</button>
          </div>
          <div className={styles.mobileMenu}>
            <div
              className={styles.userIcon}
              onClick={() => {
                setShowMenu(false);
                navigate("/home");
              }}
            >
              <img
                className={styles.profilePicture}
                src={`${import.meta.env.VITE_STATIC_URL}/img/users/${
                  user.photo
                }`}
                alt='user'
              ></img>
              {user.username}
            </div>
            {showMenu ? (
              <AiOutlineClose onClick={() => setShowMenu(false)} size={50} />
            ) : (
              <AiOutlineMenu onClick={() => setShowMenu(true)} size={50} />
            )}
            {transitions(
              (animationStyles, item) =>
                item && (
                  <animated.div
                    className={styles.menuOptions}
                    style={animationStyles}
                  >
                    {location.pathname === "/home/feed" ? (
                      <Link
                        to=''
                        onClick={() => setShowMenu(false)}
                        className={styles.btn}
                      >
                        my profile
                      </Link>
                    ) : (
                      <Link
                        to='feed'
                        onClick={() => setShowMenu(false)}
                        className={styles.btn}
                      >
                        feed
                      </Link>
                    )}
                    <span
                      onClick={() => {
                        setUserAccountMenu(true);
                        setShowMenu(false);
                      }}
                    >
                      account settings
                    </span>
                    <span onClick={logout}>logout</span>
                  </animated.div>
                )
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
