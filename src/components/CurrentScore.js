
const CurrentScore = ({ score, login, loginHandler, name, probNum }) => {

    return (
        <div className="current-score">
            <h2>My Score</h2>
            { login ?
                <span>{name}</span>
                :
                <button onClick={loginHandler}>구글 계정으로 로그인</button>}
            <br/>
            <span>{score} / {probNum}</span>
        </div>
    );
}

export default CurrentScore;