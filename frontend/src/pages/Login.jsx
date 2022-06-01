import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import validator from "validator";
import { BeatLoader } from "react-spinners";
import UserContext from "../UserContext";
import { SocketContext } from "../utils/socketContext";
import { animated, useSpring } from "react-spring";

import Logo from "../components/Logo";

import styles from "../sass/login.module.scss";

const Login = () => {
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 100,
    config: { mass: 1, tension: 50, friction: 18 },
  });
  const [formFields, setFormFields] = useState({ email: "", password: "" });
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const socket = useContext(SocketContext);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) return navigate("/home");
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormFields((f) => {
      return { ...f, [id]: value };
    });
  };

  const displayError = (...msg) => {
    setErrorMessages(msg);
    setTimeout(() => {
      setErrorMessages([]);
    }, 2000);
    return false;
  };

  const validateFields = () => {
    const { email, password } = formFields;
    if (!email || !password) return displayError("Fields cannot be empty");
    if (!validator.isEmail(email))
      return displayError("Please provide a valid email");
    if (password.length < 8)
      return displayError("Please provide a valid password");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);
    try {
      const req = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
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
      } else displayError("incorrect username or password");
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
            <label htmlFor='email'>email</label>
            <input
              id='email'
              value={formFields.email}
              type='text'
              onChange={handleChange}
            />
            <label htmlFor='password'>password</label>
            <input
              id='password'
              value={formFields.password}
              type='password'
              onChange={handleChange}
            />
            <div className={styles.errors}>
              {errorMessages.map((msg) => (
                <div key={msg} className='error-message'>
                  {msg}
                </div>
              ))}
            </div>
            <button className={styles.btn} type='submit'>
              {loading ? <BeatLoader /> : "login"}
            </button>
          </form>
          <div>
            don't have an account? <Link to='/signup'>sign up</Link>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default Login;
