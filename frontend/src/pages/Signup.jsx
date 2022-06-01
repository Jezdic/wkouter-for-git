import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import formErrors from "../utils/formErrors";
import { BeatLoader } from "react-spinners";
import { useSpring, animated } from "react-spring";
import UserContext from "../UserContext";
import { SocketContext } from "../utils/socketContext";

import Logo from "../components/Logo";

import styles from "../sass/signup.module.scss";

const Signup = () => {
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 100,
    config: { mass: 1, tension: 50, friction: 18 },
  });

  const initState = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };
  const [formFields, setFormFields] = useState(initState);
  const [errorMessages, setErrorMessages] = useState(initState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const socket = useContext(SocketContext);

  const validateField = (e) => {
    const { id, value } = e.target;
    const msg =
      id === "passwordConfirm"
        ? formErrors[id].call({
            passwordConfirm: value,
            password: formFields.password,
          })
        : formErrors[id].call(value);
    if (msg) {
      e.target.style = "border: 2px solid #e24d67";
      setErrorMessages((errors) => {
        return { ...errors, [id]: msg };
      });
    }
  };

  const handleFocus = (e) => {
    e.target.style = "";
    setErrorMessages((errors) => ({ ...errors, [e.target.id]: "" }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormFields((f) => {
      return { ...f, [id]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errorMessages).some((el) => el !== "")) return;
    if (Object.values(formFields).some((el) => el === "")) return;
    setLoading(true);
    try {
      const req = await fetch(`${import.meta.env.VITE_API_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
      });
      const res = await req.json();
      if (res.status === "success") {
        localStorage.setItem("token", `Bearer ${res.token}`);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/home");
        socket.emit("LOGIN_SUCCESS", res.data.user.username);
      }
      if (res.status === "fail" && res.message.startsWith("Duplicate"))
        return setErrorMessages((err) => {
          return { ...err, email: "Email address already in use." };
        });
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <animated.div style={props}>
      <div className={styles.centered}>
        <div className={styles.container}>
          <Logo type={"header"} />
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor='name'>
              username{" "}
              <span className={styles.error}>{errorMessages.username}</span>
            </label>
            <input
              id='username'
              type='text'
              onBlur={validateField}
              onChange={handleChange}
              onFocus={handleFocus}
            />
            <label htmlFor='email'>
              email <span className={styles.error}>{errorMessages.email}</span>
            </label>
            <input
              id='email'
              type='text'
              onChange={handleChange}
              onBlur={validateField}
              onFocus={handleFocus}
            />

            <label htmlFor='password'>
              password{" "}
              <span className={styles.error}>{errorMessages.password}</span>
            </label>
            <input
              id='password'
              type='password'
              onChange={handleChange}
              onBlur={validateField}
              onFocus={handleFocus}
            />

            <label htmlFor='passwordConfirm'>
              confirm password{" "}
              <span className={styles.error}>
                {errorMessages.passwordConfirm}
              </span>
            </label>
            <input
              id='passwordConfirm'
              type='password'
              onChange={handleChange}
              onBlur={validateField}
              onFocus={handleFocus}
            />
            <button className={styles.btn} type='submit'>
              {loading ? <BeatLoader /> : "signup"}
            </button>
          </form>
          <div>
            already have an account? <Link to='/'>log in!</Link>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Signup;
