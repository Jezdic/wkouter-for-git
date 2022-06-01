import { useContext, useState, useReducer, useEffect } from "react";
import useEscape from "../../utils/useEscape";

import UserContext from "../../UserContext";

import { animated, useTransition } from "react-spring";
import { BeatLoader } from "react-spinners";

import { AiOutlineMinusCircle } from "react-icons/ai";

import styles from "../../sass/user/accountSettings.module.scss";

const options = {
  from: { y: -100, zIndex: 100, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  leave: { y: -100, zIndex: -100, opacity: 0 },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "change_input":
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
};

const initPassword = {
  passwordCurrent: "",
  password: "",
  passwordConfirm: "",
};

const AccountSettings = ({ toggle, setToggle }) => {
  const { user, setUser } = useContext(UserContext);
  const [userInfo, dispatchInfo] = useReducer(reducer, {
    username: user.username,
    email: user.email,
    photo: null,
  });
  const [passwordData, dispatchPassword] = useReducer(reducer, initPassword);
  const [loading, dispatchLoading] = useReducer(reducer, {
    password: false,
    info: false,
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEscape(setToggle);

  useEffect(() => {
    if (!selectedPhoto) return setPreview(undefined);

    const objectUrl = URL.createObjectURL(selectedPhoto);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0)
      return setSelectedPhoto(undefined);

    setSelectedPhoto(e.target.files[0]);
  };

  const createChangeHandler = (type) => (e) => {
    const { name, value } = e.target;
    if (type === "info")
      dispatchInfo({ type: "change_input", key: name, value });
    else dispatchPassword({ type: "change_input", key: name, value });
  };

  const generateFormData = () => {
    let form = new FormData();
    form.append("username", userInfo.username);
    form.append("email", userInfo.email);
    if (selectedPhoto) form.append("photo", selectedPhoto);
    console.log(form);
    return form;
  };

  const createSubmitHandler =
    (type = "info") =>
    async (e) => {
      e.preventDefault();
      dispatchLoading({ type: "change_input", key: type, value: true });
      const url = `${import.meta.env.VITE_API_URL}/users/${
        type === "info" ? "updateMe" : "updateMyPassword"
      }`;
      const payload =
        type === "info" ? generateFormData() : JSON.stringify(passwordData);

      const headers = { authorization: localStorage.getItem("token") };

      if (type === "password") headers["Content-Type"] = "application/json";
      try {
        const req = await fetch(url, {
          method: "PATCH",
          headers,
          body: payload,
        });
        const res = await req.json();
        if (res.status === "success" && type === "info") setUser(res.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setSelectedPhoto(null);
        dispatchLoading({ type: "change_input", key: type, value: false });
      }
    };

  const handleSaveInfo = createSubmitHandler("info");
  const handleChangeInfo = createChangeHandler("info");

  const handleUpdatePassword = createSubmitHandler("password");
  const handleChangePassword = createChangeHandler("password");

  const transitions = useTransition(toggle, options);
  return transitions(
    (animationStyles, item) =>
      item && (
        <animated.div className={styles.container} style={animationStyles}>
          <AiOutlineMinusCircle
            className={styles.exitBtn}
            onClick={() => setToggle(false)}
          />
          <img
            className={styles.avatar}
            alt='user'
            src={`${import.meta.env.VITE_STATIC_URL}/img/users/${user.photo}`}
          />
          <label className={styles.photoLabel}>
            change photo
            <input
              type='file'
              className={styles.changePhoto}
              onChange={onSelectFile}
            />
          </label>
          {selectedPhoto && (
            <div style={{ marginTop: "8px" }}>
              <img
                className={styles.preview}
                width='20px'
                src={preview}
                alt='preview'
              />
              <span style={{ cursor: "pointer" }} onClick={handleSaveInfo}>
                save
              </span>
            </div>
          )}
          <h1 className={styles.header}>my account</h1>
          <div className={styles.optionsContainer}>
            <form className={styles.infoForm} onSubmit={handleSaveInfo}>
              <label>username </label>
              <input
                name='username'
                type='text'
                value={userInfo.username}
                onChange={handleChangeInfo}
              />
              <label>email</label>
              <input
                name='email'
                type='text'
                value={userInfo.email}
                onChange={handleChangeInfo}
              />
              <button className={styles.saveBtn}>
                {loading.info ? <BeatLoader size={10} /> : "save"}
              </button>
            </form>
            <form className={styles.infoForm} onSubmit={handleUpdatePassword}>
              <input
                name='passwordCurrent'
                type='password'
                placeholder='current password'
                onChange={handleChangePassword}
              />
              <input
                name='password'
                type='password'
                placeholder='new password'
                onChange={handleChangePassword}
              />
              <input
                name='passwordConfirm'
                type='password'
                placeholder='confirm password'
                onChange={handleChangePassword}
              />
              <button className={styles.saveBtn}>
                {loading.password ? (
                  <BeatLoader size={10} />
                ) : (
                  "update password"
                )}
              </button>
            </form>
          </div>
        </animated.div>
      )
  );
};

export default AccountSettings;
