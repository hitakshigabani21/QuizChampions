import React, { useState, useEffect } from 'react';
import './App.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';  //import for integrating socket io client side

const socket = io("ws://localhost:5000");  // connects to the server hosted at localhost:5000

function App() {
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);
  const [info, setInfo] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [seconds, setSeconds] = useState();
  const [scores, setScores] = useState([]);
  const [winner, setWinner] = useState();
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // Added state for alert
  // const [isEmpty, setIsEmpty] = useState(true);

  let isEmpty = true;

  //function --> after the answer form is submitted in the beginning, after the info is fetched then we render another div using conditional rendering 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && room) {
      setInfo(true);                // if name and room is there then setInfo true, if info is false then form must be displayed else quiz will be displayed.
      // setIsEmpty(false);
    }
  };


  // if the user submits the form , then they join the room , a message to the server is send to join room, using socket.emit()

  useEffect(() => {
    if (name) {
      socket.emit('joinRoom', room, name);
    }
  }, [info]);


//newQuestion : updates the UI with a new questions, options, and timer

  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      setOptions(data.answers);
      setAnswered(false);
      setSeconds(data.timer);
      setSelectedAnswerIndex(null);
      setShowAlert(false); // Reset alert when a new question is received
    });

//answerResult : updates the leaderboard based on scores received from the server

    socket.on('answerResult', (data) => {
      setScores(
        data.scores.sort((a, b) => b.score - a.score) // Sort leaderboard by score
      );
    });

//Displays the winner and final leader board

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('gameOver');
    };
  }, []);


//Count down timer

  useEffect(() => {
    if (seconds === 0) return;

    if (seconds === 5 && !showAlert) {
      setShowAlert(true); // Set alert when seconds is 5 for the first time
    }

    const timerInterval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [seconds, showAlert]);


// function to handle answer, if it is answered then set the selected answer to false and if it is submitted then sent a message to server and check the answer, call submit answer
//Submits the selected answer index to the server using socket.emit()


  const handleAnswer = (answerIndex) => {
    if (!answered) {
      setSelectedAnswerIndex(answerIndex);
      socket.emit('submitAnswer', room, answerIndex);
      setAnswered(true);
    }
  };

// leader board after we get the name of winner
  if (winner) {
    return (
    <div>
      <h1 className="final-leaderboard-title">{winner} Wins!🏅</h1>
      <div className = "final-leaderboard-outerbox margin">
        <h2>Leader Board </h2>
        <div className="final-leaderboard">
          {scores.map((player, index) => (
            <div key={index} className="leaderboard-item">
              <span className="rank">Rank : {index + 1}</span>
              <span className="name">{player.name}</span>
              <span className="score">Score : {player.score}</span>
            </div>
          ))}
        </div>
      </div>
  </div>);
  }

  return (
    <div className="App">
      {!info ? (
        <div className="join-div">
          <h1>Quiz Champion </h1>
          {isEmpty ? <div >
            <p className = "intro">"Welcome to the ultimate 5-point quiz challenge! 🎯 Each correct answer brings you closer to the top of the leaderboard. 🏅 Think you’ve got what it takes to outsmart the competition? Show off your knowledge, earn points, and climb to the #1 spot! 🔥 The game is on, and the leaderboard awaits your name. Ready to rise to the challenge and claim victory? Let's go! 🚀💥"</p>
            <p>Enter your Name and Room id to dive into this game!</p>
            </div>:""}
          <div className = "form">
            <form onSubmit={handleSubmit}>
              <input required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                required
                placeholder="Enter room no"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
              <button type="submit" className="join-btn">
                JOIN
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="quiz-outerdiv">
          <h1>QuizChampion</h1>
          <p className="room-id">Room Id: {room}</p>
          {/* <ToastContainer /> */}

          {question ? (
            <div className="quiz-div">
              <p> 
                {showAlert
                  ? `Alert! only ${seconds}s left`
                  : `Remaining Time: ${seconds}s`}
              </p>
              <div className="qleader">
              <div className = "question-box">
                <div className="question">
                  <p className="question-text">Q. {question}</p>
                </div>
                <ul className="option-box">
                  {options.map((answer, index) => (
                    <li key={index}>
                      <button
                        className={`options ${
                          selectedAnswerIndex === index ? 'selected' : ''
                        }`}
                        onClick={() => handleAnswer(index)}
                        disabled={answered}
                      >
                         {answer}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            
            <div className = "leaderboard-outerbox">
                <div className="leaderboard">
                <h2 className="leaderboard-title">Leaderboard</h2>
                  {scores.map((player, index) => (
                    <div key={index} className="leaderboard-item">
                      <span className="rank">Rank : {index + 1}</span>
                      <span className="name">{player.name}</span>
                      <span className="score">Score : {player.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </div>
          ) : (
            <p>Loading question...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
