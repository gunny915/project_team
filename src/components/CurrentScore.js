
import React, {useState} from 'react';

const CurrentScore = ({score, login,loginHandler,name}) => {

    return (
        <div className="current-score">
            <h2>My Score</h2>
            {login ?<span>{name}</span> :<button onClick={loginHandler}>구글계정으로 로그인</button>}
            <br/>
            <span> {score} / 10</span>
        </div>
    );
}

export default CurrentScore;