import "./App.css";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const storage = firebase.storage();



function App() {

    // MARK:- Variables
    const problemsCount = 15;
    const db = firebase.firestore();

    const [gameStart, setStart] = useState(false);
    const [probNum, setProbNum] = useState(0);
    const [shuffled, setShuffled] = useState([]);
    const [currScore, setCurr] = useState(0);
    const [imgUrl, setImg] = useState(null);
    const [login, setLogin] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [ranking, setRanking] = useState([]);
    const [rankingScore, setRankingScore] = useState([]);
    const [answers, setAnswers] = useState([]);

    let problems = [];
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

    // DB에서 오는 데이터 담아두기 위한 빈 Array
    let dbScoreReceiver = [];
    let dbAnswerReceiver = [];

    // MARK:- Functions

    // Start Game
    const startGame = () => {
        if (answers.length === 0) {
            alert('잠시 후에 다시 시도해 주세요!')
        } else {
            setStart(true);
        }
    }
    // Next question
    const nextQ = (e) => {
        e.preventDefault();
        const userInput = document.getElementById("input").value;
        const answer = answers[shuffled[probNum - 1] - 1];

        // 정답이라면 현재 점수 +1
        if (userInput === answer) {
            setCurr(currScore + 1);
        }
        // 다음 문제로 + 1
        setProbNum(probNum + 1);

        // 입력칸 초기화
        document.getElementById("input").value = "";
    };

    // End game - 게임 종료 시 db에 결과 보내고 다시 받아서 top3 선별
    const endGame = () => {
        setCurr(0);
        createScore();
        dbGetScores();
        setImg(null);
    };

    // Storage의 파일 수 totalCount로부터 사이즈가 probCount인 랜덤 Array 생성
    const getRandomProblemArray = (arr, probCount, totalCount) => {
        while(arr.length < probCount){
            let r = Math.floor(Math.random() * totalCount) + 1;
            if(arr.indexOf(r) === -1) arr.push(r);
        }
        return arr;
    }

    // Google log-in
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
                console.log(error);
            });
    };

    // 게임 종료 시 user, score 정보 DB에 보냄
    const createScore = () => {
        db.collection("scores").add({
            "user": name,
            "score": currScore
        })
            .then(() => {
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // (db 받아옴)구글 로그인된 상태에서 진행한 결과값만 받아와서 top3 user,score 선별
    const dbGetScores = () => {
        db.collection("scores").where("user","!=", "")
            .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                dbScoreReceiver.push(doc.data());
            });
            makeRanking();
        });
    }
    // DB에서 정답 가져오기
    const dbGetAnswers = () => {
        db.collection("answers").where("index","!=", "")
            .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                dbAnswerReceiver.push(doc.data());
            });
            makeAnswers();
        });
    }

    // top3 user, score 고르기 (어쩌다보니 hard-coding으로 구현했습니다..)
    const makeRanking = () => {
        let s = [-1,-1,-1];   //score
        let u = ['','',''];   //user
        for(let i=0 ; i < dbScoreReceiver.length ; i++) {
            let num = dbScoreReceiver[i]["score"] ;    //확인할 score
            if (num > s[0]) {
                s[2] = s[1];
                u[2] = u[1];
                s[1] = s[0];
                u[1] = u[0];
                s[0] = num;
                u[0] = dbScoreReceiver[i]["user"];
            } else if (num > s[1]) {
                s[2] = s[1];
                u[2] = u[1];
                s[1] = num;
                u[1] = dbScoreReceiver[i]["user"];
            } else if (num > s[2]) {
                s[2] = num;
                u[2] = dbScoreReceiver[i]["user"];
            }
        }
        setRanking(u);
        setRankingScore(s);
    }
    // 정답 Array 생성
    const makeAnswers = () => {
        let temp = [];
        for(let i = 0; i < dbAnswerReceiver.length; i++) {
            const answer = dbAnswerReceiver[i]["answer"];
            temp.push(answer);
        }
        setAnswers(temp);
    }

    // MARK:- useEffect

    // DB에서 데이터 받음
    useEffect(() => {
        dbGetScores();
        dbGetAnswers()
    },[]);


    // Set up game
    useEffect(() => {
        if (gameStart) {
            const shuffledIndex = getRandomProblemArray(problems, problemsCount, answers.length);
            setShuffled(shuffledIndex);
            setProbNum(1);
            setCurr(0);
        }
    }, [gameStart]);

    // Finish game when probNum exceeds problemsCount
    useEffect(() => {
        if (gameStart) {
            if (probNum > problemsCount) {
                setStart(false);
                alert(`You got ${currScore} correct!`);
                endGame();
            }
        }
    }, [probNum]);

    // Set up img url to load img from firebase storage
    useEffect(()=>{
        if (gameStart) {
            if (probNum <= problemsCount) {
                const imgUrls = `gs://teamproject-b06dd.appspot.com/${shuffled[probNum - 1]}.jpg`;
                const gsReference = storage.refFromURL(imgUrls);
                gsReference.getDownloadURL().then(function(url) {
                    setImg(url);
                }, function(error){
                    console.log(error);
                });
            }
        }
    }, [probNum]);

    return (
        <div className="App">
            <header>
                <div className="header-left">
                    <Scoreboard
                        userArr={ranking}
                        scoreArr={rankingScore}
                    />
                </div>
                <h1>이름 맞추기</h1>
                <div className="header-right">
                    <CurrentScore
                        score={currScore}
                        login={login}
                        loginHandler={loginHandler}
                        name={name}
                        probNum={problemsCount}
                    />
                </div>
            </header>
            <br/>
            <div className="game">
                <div>
                    {gameStart === true ?
                        <>
                            <div className="problem">
                                <label className="probNum">#{probNum}</label>
                                <br/>
                                <img className="img" src={imgUrl} height="400" />
                                <br/>
                                <form className="answer-form" autoComplete="off" onSubmit={nextQ}>
                                    <input type="text" id="input"/>
                                    <button type="submit" className="ans_button">Ok</button>
                                </form>
                            </div>
                        </>
                        :
                        <>
                            <div className="pre-start">
                                <span>유명한 사람의 얼굴과 이름을 맞춰볼까요?</span>
                                <span>총 {problemsCount}문제가 출제되며 구글 로그인을 통해 스코어보드에 이름을 올리세요!</span>
                                <Button type="button" variant="contained" size="large" color="primary" onClick={startGame}>Start</Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
