import React from "react";

const Scoreboard = ({userArr, scoreArr}) => {
    return (
      <div className="scoreboard">
          <h2>High Score</h2>
          <span>1등 : {userArr[0]}, {scoreArr[0]}점</span>
          <br/>
          <span>2등 : {userArr[1]}, {scoreArr[1]}점</span>
          <br/>
          <span>3등 : {userArr[2]}, {scoreArr[2]}점</span>
          <br/>
      </div>
    );
}

export default Scoreboard;