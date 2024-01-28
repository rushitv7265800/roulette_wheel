import axios from "axios";
import "./css/Wheel.scss";
import io from "socket.io-client";
import "./css/styles.scss";
import "./css/customStyle.css";
import "./css/responsive.scss";
import DiamondIcon from "./assets/diamond.png";
import GameTable from "./GameMain/GameTable";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ReactComponent as QuestionIcon } from "./assets/questionIcon.svg";
import { ReactComponent as SoundUpIcon } from "./assets/soundUp.svg";
import { ReactComponent as SoundMuteIcon } from "./assets/soundMute.svg";
import "react-toastify/dist/ReactToastify.css";
import WheeSpin from "./GameMain/WheeSpin";
import { timer } from "./GameMain/Observable";
import RulesModel from "./GameMain/RulesModel.";
import HistoryModel from "./GameMain/HistoryModel";
import NewTable from "./NewGame/NewTable";

// export const baseURL = "http://192.168.29.241:5040/";
export const baseURL = "https://rouletteCasinoGame.codderlab.com/";
// export const baseURL = "https://roulette-wheel-casino-game.onrender.com/";
export const adminBaseURL = " https://allinone.codderlab.com/";
export const key = "vguikkOUno8Xcfvjhkiyb06aIKrejZ9R4h";
const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get("id");
axios.defaults.headers.common["key"] = key;

const rouletteWheelNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const gameNumber = [50, 100, 200, 400, 800, 1000];
const soundGet = JSON.parse(localStorage.getItem("sound"));
let historyRecord = [];
function App() {
  const socketRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [numberSelect, setNumberSelect] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [rouletteData, setRouletteData] = useState();
  const [number, setNumber] = useState();
  const [time, setTime] = useState();
  const [isActive, setIsActive] = useState(true);
  const numberRef = useRef(null);
  const [rulesModelOpen, setRulesModelOpen] = useState(false);
  const [historyModel, setHistoryModel] = useState(false);
  const [muteSound, setMuteSound] = useState(soundGet);
  const [getRules, setGetRules] = useState("");
  const [gameCoin, setGameCoin] = useState(gameNumber);
  const [state, setState] = useState({
    rouletteData: {
      numbers: rouletteWheelNumbers,
    },
    number: {
      next: "Spin",
    },
  });

  useEffect(() => {
    localStorage.setItem("sound", muteSound);
  }, [muteSound]);

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
              console.log("data",data);
              setUserData(data);
            });

            socketRef.current?.on("time", (time) => {
              setTime(time);
            });
          }, 1000);
        }
      });

      socketRef.current?.on("historyRecord", (historyRecordData) => {
        historyRecord = historyRecordData;
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [userId]);

  useEffect(() => {
    axios
      .get(`${adminBaseURL + "setting"}`)
      .then((res) => {
        // setGameCoin(res?.data?.setting?.gameCoin);
        setGetRules(res?.data?.setting?.roulette_gameRule);
      })
      .catch((err) => console.log(err));
  }, []);

  const setGameData = (gameData) => {
    const endTime = 35;
    const nextNumber = gameData.value;
    setState((prevState) => ({
      ...prevState,
      endTime: endTime,
      progressCountdown: endTime - gameData.time_remaining,
      number: { next: nextNumber },
    }));
  };

  const handleSubmit = (e) => {
    if (numberSelect) {
      setTime(0);
      setState({
        rouletteData: {
          numbers: rouletteWheelNumbers,
        },
        number: {
          next: parseInt(numberSelect),
        },
      });
    }
  };

  socketRef.current?.on("game", (obj) => {
    setState({
      ...state,
      number: {
        next: obj?.Combinations,
      },
    });
  });

  const handleOpenModel = (type) => {
    if (type === "rule") {
      setRulesModelOpen(true);
      setHistoryModel(false);
    } else {
      setRulesModelOpen(false);
      setHistoryModel(true);
      socketRef?.current?.emit("historyRecord", {

      });

    }
  };

  const handleMuteSound = () => {
    setMuteSound((prevMute) => !prevMute);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <div className="game-content">
        {/* <NewTable socketRef={socketRef} gameCoin={gameCoin} userData={userData}/> */}
        <GameTable
          userData={userData}
          socketRef={socketRef}
          rouletteData={state?.rouletteData}
          number={state?.number}
          startTime={time}
          isActive={isActive}
          setIsOpen={setIsOpen}
          setMuteSound={setMuteSound}
          muteSound={muteSound}
          gameCoin={gameCoin}
          setGameCoin={setGameCoin}
          isOpen={isOpen}
        />
      </div>
      {/* <div className="row game-page">
        <div className="col-0  col-lg-3">
        </div>
        <div className="col-12  col-lg-6  game-show">
          <div className="top-btn-show">
            <div className="helpIcon-button">
              <button
                onClick={(event) => {
                  handleOpenModel("rule");
                  event.stopPropagation();
                }}
              >
                <QuestionIcon />
              </button>
            </div>
            <div className="history-icon">
              <button
                onClick={(event) => {
                  handleOpenModel("history");
                  event.stopPropagation();
                }}
              >
                <i class="fas fa-history"></i>
              </button>
            </div>
            <div className="sound-icon">
              <button onClick={() => handleMuteSound()}>
                {muteSound ? <SoundMuteIcon /> : <SoundUpIcon />}
              </button>
            </div>
          </div>
          <div className="dimond-coin">
            <img src={DiamondIcon} />
            <span>
              {userData?.diamond ? userData?.diamond?.toLocaleString() : "0"}
            </span>
          </div>
          <WheeSpin />
          <GameTable
            userData={userData}
            socketRef={socketRef}
            rouletteData={state?.rouletteData}
            number={state?.number}
            startTime={time}
            isActive={isActive}
            setIsOpen={setIsOpen}
            setMuteSound={setMuteSound}
            muteSound={muteSound}
            gameCoin={gameCoin}
            setGameCoin={setGameCoin}
            isOpen={isOpen}
          />
          <RulesModel
            setOpen={setRulesModelOpen}
            open={rulesModelOpen}
            rule={getRules}
          />
          <HistoryModel
            setOpen={setHistoryModel}
            open={historyModel}
            historyData={historyRecord}
          />
        </div>
        <div className="col-0 col-lg-3"></div>
      </div> */}
      <ToastContainer />
    </div>
  );
}

export default App;
