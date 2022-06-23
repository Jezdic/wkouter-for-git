import { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";

import UserWorkout from "../components/workout/UserWorkout";

const Feed = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [noFollowers, setNoFollowers] = useState(false);
  const [page, setPage] = useState(2);
  const { user } = useContext(UserContext);
  const limit = 4;

  const fetchWorkouts = async (page = 1) => {
    try {
      const req = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/workouts/getFeed?page=${page}&limit=${limit}&sort=-createdAt`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const res = await req.json();
      if (res.status === "success") {
        if (res.total === 0) setNoFollowers(true);
        else if (page === 1) setWorkouts(res.workouts);
        else {
          setWorkouts((wr) => [...wr, ...res.workouts]);
          if (page * limit >= res.total) setHasMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
    setPage(2);
    setHasMore(true);
    if (user.following.length === 0) setNoFollowers(true);
    else setNoFollowers(false);
  }, [user]);

  const handleNext = () => {
    fetchWorkouts(page);
    setPage((p) => p + 1);
  };

  return (
    <>
      {loading ? (
        <PulseLoader color='#0dbacc' />
      ) : noFollowers ? (
        <p style={{ color: "#0dbacc" }}>you don't follow anyone yet!</p>
      ) : workouts.length === 0 ? (
        <p style={{ color: "#0dbacc" }}>no workouts to display</p>
      ) : (
        <InfiniteScroll
          dataLength={workouts.length}
          next={handleNext}
          hasMore={hasMore}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          loader={<PulseLoader color='#0dbacc' />}
        >
          {workouts.map((wr) => (
            <UserWorkout
              initWorkout={wr}
              key={wr._id}
              type='feed'
              myUsername={user.username}
              myPhoto={user.photo}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default Feed;
