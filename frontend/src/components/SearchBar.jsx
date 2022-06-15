import { useEffect, useState, useContext } from "react";

import UserContext from "../UserContext";

import { useNavigate } from "react-router-dom";

import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

import styles from "../sass/SearchBar.module.scss";

const SearchBar = ({ setShowLogo }) => {
  const { user: loggedInUser } = useContext(UserContext);
  const [showSearchIcon, setShowSearchIcon] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  console.log(loggedInUser);

  const handleBlur = () => {
    setShowLogo(true);
    setShowSearchIcon(true);
  };

  const handleFocus = () => {
    setShowLogo(false);
    setShowSearchIcon(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const loadSearchResults = async () => {
    if (!searchQuery) return setUsers([]);

    const req = await fetch(
      `${import.meta.env.VITE_API_URL}/users/searchUsers/${searchQuery}`,
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    const { users } = await req.json();

    setUsers(users);
  };

  useEffect(loadSearchResults, [searchQuery]);

  const handleNavigate = (username) => {
    navigate(`/home/user/${username}`);
    setSearchQuery("");
  };

  return (
    <div className={styles.container}>
      {!showSearchIcon && (
        <>
          <AiOutlineClose className={styles.exitSearch} size={35} />
          <div className={styles.searchResults}>
            {users.map((user) => (
              <div
                className={styles.user}
                onMouseDown={() => handleNavigate(user.username)}
              >
                <img
                  src={`${import.meta.env.VITE_STATIC_URL}/img/users/${
                    user.photo
                  }`}
                />
                <span className={styles.username}>{user.username}</span>
                {loggedInUser.following.some(
                  (follower) => follower.username === user.username
                ) && <span className={styles.following}>following</span>}
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.searchContainer}>
        {showSearchIcon && (
          <AiOutlineSearch size={25} className={styles.searchIcon} />
        )}
        <input
          placeholder='search'
          value={searchQuery}
          className={styles.searchInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
