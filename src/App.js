import axios from "axios";
import "./css/Wheel.scss";
import "./css/styles.scss";
import "./css/customStyle.css";
import "./css/responsive.scss";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import io from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./Auth/LoginPage";
import GamePage from "./GamePage/GamePage";
import LoadingSvg from "./GamePage/extra/LoadingSvg";

// export const baseURL = "http://192.168.43.143:5040/";

// export const baseURL = "http://192.168.29.241:5040/";
// export const baseURL = "https://rouletteCasinoGame.codderlab.com/";
export const baseURL = "https://roulette-wheel-game.onrender.com/";
export const adminBaseURL = " https://allinone.codderlab.com/";
export const key = "vguikkOUno8Xcfvjhkiyb06aIKrejZ9R4h";
const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get("id") ? queryParams.get("id") : "6527da15bdfb0b7c39fd700f";
// axios.defaults.headers.common["key"] = key;
let historyRecord = [];
const isAuthGet = JSON.parse(sessionStorage.getItem("isAuth"))
const loaderShowGet = JSON.parse(sessionStorage.getItem("loader"))

function App() {
  const socketRef = useRef()
  const [userData, setUserData] = useState({});
  const [time, setTime] = useState();
  const [isAuth, setIsAuth] = useState(isAuthGet?.length ? isAuthGet : false)
  const [loaderShow, setLoaderShow] = useState(loaderShowGet?.length ? loaderShowGet : false)
  const navigate = useNavigate()


  useEffect(() => {
    const socket = io.connect(baseURL, {
      transports: ["websocket", "polling", "flashsocket"],
      query: { globalRoom: userId },
    });
    if (userId) {
      socketRef.current = socket;
      socketRef.current.on("connect", () => {
        if (socket.connected === true) {
          setTimeout(() => {
            socket.emit("startGame", {});
            socket.on("start", (data) => {
              setUserData(data);
            });

            socketRef.current?.on("time", (time) => {
              setTime(time);
            });
            socketRef.current?.on("loginData", (data) => {
              setIsAuth(data?.login)
              sessionStorage.setItem("isAuth", data?.login)
            });
          }, 1000);
        }
      });

      socketRef.current?.on("historyRecord", (historyRecordData) => {
        historyRecord = historyRecordData;
      });
    }
  }, [userId]);

  useEffect(() => {
    console.log("isAuth", isAuth);
    console.log("isAuth", loaderShow);
    if (isAuth === true && loaderShow === false) {

      const progressBars = document.querySelectorAll('.progress_bar_item');
      progressBars.forEach(progressBar => animateProgressBar(progressBar));
    }
  }, [isAuth, loaderShow]);

  const animateProgressBar = (progressBar) => {
    const speed = 30;
    const item = progressBar.querySelector('.progress');
    const itemValue = parseInt(item.dataset.progress);
    let i = 0;

    const count = setInterval(() => {
      if (i <= itemValue) {
        item.style.width = i + '%';
        progressBar.querySelector('.item_value').innerHTML = i + '%';
      } else {
        clearInterval(count);
        sessionStorage.setItem("loader", true)
        setLoaderShow(loaderShow)
        setTimeout(() => {
          navigate('/game')
        }, 200);
      }
      i++;
    }, speed);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage socketRef={socketRef}  isAuth={isAuth} loaderShow={loaderShow}/>} />
        <Route path="/game" element={<GamePage historyRecord={historyRecord} socketRef={socketRef} setTime={setTime} setUserData={setUserData} time={time} userData={userData} />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
