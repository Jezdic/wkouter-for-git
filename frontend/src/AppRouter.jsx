import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContext from "./UserContext";
import { SocketContext, socket } from "../src/utils/socketContext";
import { useState, lazy, useEffect, Suspense } from "react";

// import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyProfile from "./pages/MyProfile";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import WorkoutPage from "./pages/WorkoutPage";

import styles from "./sass/App.module.scss";

const Home = lazy(() => import("./pages/Home"));

const AppRouter = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) return;
    const parsedUser = JSON.parse(user);
    setUser(parsedUser);
    socket.emit("LOGIN_SUCCESS", parsedUser.username);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='signup' element={<Signup />}></Route>
            <Route
              path='/home'
              element={
                <Suspense fallback={<>...</>}>
                  <Home />
                </Suspense>
              }
            >
              <Route path='' element={<MyProfile />}></Route>
              <Route path='feed' element={<Feed />}></Route>
              <Route
                path='workout/:workoutId'
                element={<WorkoutPage />}
              ></Route>
              <Route path='user/:username' element={<UserProfile />}></Route>
            </Route>
          </Routes>
        </UserContext.Provider>
      </SocketContext.Provider>
    </BrowserRouter>
  );
};

export default AppRouter;
