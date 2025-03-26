#  Multiplayer Quiz Game  

A real-time multiplayer quiz game where players compete individually or in groups, answer timed questions, and climb the leaderboard to win!  

##  Features  

- **Real-Time Multiplayer** – Join rooms and play with friends using **Socket.io**.  
- **Live Leaderboard & Scoring** – Scores update dynamically based on correct answers.  
- **Timed Questions & Win Condition** – Unanswered questions deduct points; first to **5 points wins**.  

##  Tech Stack  

- **Frontend:** React.js 
- **Backend:** Node.js, Express.js  
- **Real-time Communication:** Socket.io

## How to Play
1. Create or join a **room** using a Room ID.  
2. Answer questions before the timer runs out.  
3. Each correct answer increases your score; unanswered questions deduct points.  
4. Scores update dynamically on the leaderboard.  
5. The first player to **5 points wins** and the final leaderboard is displayed.

##  Installation & Setup  

```sh
# Clone the repository
git clone https://github.com/yourusername/multiplayer-quiz-game.git
cd multiplayer-quiz-game

# Install dependencies and start the backend
cd backend
npm install
npm start

# Install dependencies and run the frontend
cd ../frontend
npm install
npm run dev







