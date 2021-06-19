
import React, {useState} from 'react';

const CurrentScore = ({score}) => {

    return (
        <div className="current-score">
            <h2>My Score</h2>
            <span>여기에 유저 아이디</span>
            <br/>
            <span> {score} / 10</span>
        </div>
    );
}

export default CurrentScore;