import { useState } from "react";

import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

import styles from "../sass/SearchBar.module.scss";

const SearchBar = ({ setShowLogo }) => {
  const [showSearchIcon, setShowSearchIcon] = useState(true);

  const handleBlur = () => {
    setShowLogo(true);
    setShowSearchIcon(true);
  };

  const handleFocus = () => {
    setShowLogo(false);
    setShowSearchIcon(false);
  };

  return (
    <div className={styles.container}>
      {!showSearchIcon && (
        <>
          <AiOutlineClose className={styles.exitSearch} size={35} />
          <div className={styles.searchResults}></div>
        </>
      )}
      <div className={styles.searchContainer}>
        {showSearchIcon && (
          <AiOutlineSearch size={25} className={styles.searchIcon} />
        )}
        <input
          placeholder='search'
          className={styles.searchInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default SearchBar;
