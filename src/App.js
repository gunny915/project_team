import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
//import firebase from "firebase/app"
import {TextField} from '@material-ui/core';

import CurrentScore from "./components/CurrentScore";
import Scoreboard from "./components/Scoreboard";

function App() {

    const index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const answers = [
        '슬기',
        '다현',
        '예지',
        '유재석',
        '조세호',
        '이제훈',
        '손흥민',
        '정찬성',
        '박보영',
        '이병헌'];

    const [gameStart, setStart] = useState(false);
    const [probNum, setProbNum] = useState(0);
    const [shuffled, setShuffled] = useState([]);
    const [currScore, setCurr] = useState(0);
    const [input, setInput] = useState('');


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
    function startGame() {
        // Game already running
        if (gameStart) {
            alert('게임이 진행중입니다');
            return;
        }
        // Check name
        setStart(true);

    };

    // Next question
    function nextQ() {
        const answer = answers[shuffled[probNum - 1] - 1];

        if (input === answer) {
            setCurr(currScore + 1);
        }
        setProbNum(probNum + 1);
    };
    // End game
    function endGame() {

    };

    // Shuffle array of questions
    function shuffle(arr) {
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
    }
    return (
        <div className="App">
            <header>
                <div>
                    <Scoreboard/>
                </div>
                <h1>맞춰봅시다</h1>
                <div>
                    <CurrentScore/>
                </div>
            </header>
            <br/>
            <div className="game">
                <div id="centered">
                    {gameStart === true ?
                        <>
                            <div className="problem" id="centered">
                                <label className="probNum">#{probNum}</label>
                                <br/>
                                <img className="img" src={process.env.PUBLIC_URL+`/img/${shuffled[probNum - 1]}.jpg`} height="400" />
                                <br/>
                                <TextField size="small" className="input" onChange={e=> setInput(e.target.value)}/>
                                <button className="ans_button" type="button" onClick={nextQ}>Ok</button>
                            </div>
                        </>
                        :
                        <>
                            <p>유명한 사람의 얼굴과 이름을 맞춰볼까요?</p>
                            <br/>
                            <button type="button" id="name_button" onClick={startGame}>Start</button>
                        </>
                    }
                </div>
            </div>
            <div className="split right">

            </div>
        </div>
    );
}

export default App;

