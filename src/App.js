import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import CurrentScore from "./components/CurrentScore";
import Scoreboard from "./components/Scoreboard";
const firebaseConfig = {
  apiKey: "AIzaSyDzurGoekqj6TXobxkgefCeGYU12NJVCAo",
  authDomain: "teamproject-b06dd.firebaseapp.com",
  databaseURL: "https://teamproject-b06dd-default-rtdb.firebaseio.com",
  projectId: "teamproject-b06dd",
  storageBucket: "teamproject-b06dd.appspot.com",
  messagingSenderId: "904090278522",
  appId: "1:904090278522:web:496acc94e5a6af37f5f9c3",
  measurementId: "G-DL6KGTY4YN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
function App() {
  const index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const answers = [
    "슬기",
    "다현",
    "예지",
    "유재석",
    "조세호",
    "이제훈",
    "손흥민",
    "정찬성",
    "박보영",
    "이병헌"
  ];

  const [gameStart, setStart] = useState(false);
  const [probNum, setProbNum] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const [currScore, setCurr] = useState(0);
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  // Setup start game
  useEffect(() => {
    // Initialize start
    if (gameStart) {
      const shuffledIndex = shuffle(index);
      setShuffled(shuffledIndex);
      setProbNum(1);
      setCurr(0);
    }
  }, [gameStart]);

  // Set up next question
  useEffect(() => {
    if (gameStart) {
      if (probNum === 11) {
        setStart(false);
        endGame();
        alert(`You got ${currScore} correct!`);
      } else {
      }
    }
  }, [probNum]);

  // Start game

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

  const startGame = () => {
    // Game already running
    if (gameStart) {
      alert("게임이 진행중입니다");
      return;
    }
    // Check name
    setStart(true);
  };

  // Next question
  const nextQ = (e) => {
    e.preventDefault();
    const userInput = document.getElementById("input").value;
    const answer = answers[shuffled[probNum - 1] - 1];

    if (userInput === answer) {
      setCurr(currScore + 1);
    }
    setProbNum(probNum + 1);
    document.getElementById("input").value = "";
  };
  // End game
  const endGame = () => {};

  // Shuffle array of questions
  const shuffle = (arr) => {
    let currentIndex = arr.length;
    let temp;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temp = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
    return arr;
  };
  const loginHandler = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        setName(result.additionalUserInfo.profile.name);
        setEmail(result.additionalUserInfo.profile.email)
        setLogin(true)
      })
      .catch((error) => {
      });
  };
  return (
    <div className="App">
      <header>
        <div>
          <Scoreboard />
        </div>
        <h1>맞춰봅시다</h1>
        <div>
          <CurrentScore
            score={currScore}
            login={login}
            loginHandler={loginHandler}
            name = {name}
          />
        </div>
      </header>
      <br />
      <div className="game">
        <div id="centered">
          {gameStart === true ? (
            <>
              <div className="problem">
                <label className="probNum">#{probNum}</label>
                <br />
                <img
                  className="img"
                  src={
                    process.env.PUBLIC_URL + `/img/${shuffled[probNum - 1]}.jpg`
                  }
                  height="400"
                />
                <br />
                <form
                  className="answer-form"
                  autoComplete="off"
                  onSubmit={nextQ}
                >
                  <input type="text" id="input"></input>
                  <button className="ans_button" type="button" onClick={nextQ}>
                    Ok
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <p>유명한 사람의 얼굴과 이름을 맞춰볼까요?</p>
              <br />
              <button type="button" id="name_button" onClick={startGame}>
                Start
              </button>
            </>
          )}
        </div>
      </div>
      <div className="split right"></div>
    </div>
  );
}

export default App;
