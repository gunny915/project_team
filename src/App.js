import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
//import firebase from "firebase/app"
import {TextField} from '@material-ui/core';

function App() {

    const index = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const answers = ['슬기','다현','예지','유재석','조세호','이제훈','손흥민','정찬성','박보영'];

    const [gameStart, setStart] = useState(false);
    const [probNum, setNum] = useState(0);
    const [shuffled, setShuffled] = useState([]);
    const [currScore, setCurr] = useState(0);
    const [input, setInput] = useState('');


    // Setup start game
    useEffect(() => {
        // Initialize start
        if (gameStart) {
            setShuffled(shuffle(index));
            setNum(1);
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
                // Next Question
                const answer = answers[shuffled[probNum] - 1];

            }
        }
    }, [probNum]);


    // Start game
    function startGame() {
        // Game already running
        if (gameStart) {
            alert('Game is already running!');
            return;
        }
        // Check name
        const nameInput = document.getElementById('name').value;
        const letters = /^[A-Za-z0-9]+$/;
        if (nameInput === '') {
            alert('Please type your name.');
        } else if (letters.test(nameInput)) {
            // Start questions
            setStart(true);
        } else {
            alert('Please type alphanumeric characters only.');
        }
    };

    // Next question
    function nextQ() {
        if (input === answers[shuffled[probNum] - 1]) {
            setCurr(currScore + 1);
        }
        setNum(probNum + 1);
    };
    console.log(document.getElementsByClassName('input').value);
    // End game
    function endGame() {

    };

    // Shuffle array of questions
    function shuffle(arr) {
        let currentIndex = arr.length;
        let temp;
        let randomIndex;

        while (currentIndex !== 0) {
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
                <h1>누구일까요?</h1>
            </header>
            <br/>
            <div className="split left">
                <div id="left" className="centered">
                    <label>Name: </label>
                    <input type="text" id="name"></input>
                    <button type="button" id="name_button" onClick={startGame}>Start</button>
                    {gameStart &&
                    <div id="problem" className="centered">
                        <label id="probNum">#{probNum}</label>
                        <br/>
                        <img id="img" src={process.env.PUBLIC_URL+`/img/${shuffled[probNum]}.jpg`} width="400" height="400" />
                        <br/>
                        <TextField size="small" className="input" onChange={e=> setInput(e.target.value)}/>
                        <button id="ans_button" type="button" onClick={nextQ}>Ok</button>
                    </div>
                    }
                </div>
            </div>
            <div className="split right">

            </div>
        </div>
    );
}

export default App;

