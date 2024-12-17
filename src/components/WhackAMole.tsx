import React, { useState, useEffect } from "react";
import "./WhackAMole.css";


const WhackAMole: React.FC = () => {
    const [holes] = useState<number[]>(Array(9).fill(0));
    const [activeMole, setActiveMole] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [difficulty, setDifficulty] = useState("medium");
    const [gameStatus, setGameStatus] = useState<"start" | "playing" | "gameover">("start");
    const [highScore, setHighScore] = useState(Number(localStorage.getItem("highscore")) || 0);


    useEffect(() => {

        if(gameStatus !== "playing") return;

        const moleInterval = setInterval(() => {
            const randomHole = Math.floor(Math.random() * holes.length);
            setActiveMole(randomHole);
        }, getInterval());

        return () => clearInterval(moleInterval);
    }, [ gameStatus, holes.length, difficulty]);


    useEffect(() => {

        if(gameStatus !== "playing") return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStatus]);

    useEffect(() => {
        if (timeLeft === 0) {
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("highscore", score.toString());
            }
            setGameStatus("gameover");
        }
    }, [timeLeft, score, highScore]);

    const handleClick = (index: number) => {
        if (index === activeMole) {
            setScore((prev) => prev + 1);
            setActiveMole(null);
        }
    };

    const getInterval = () => {
        if (difficulty === "easy") return 1500;
        if (difficulty === "medium") return 1000;

        return 700;
    };

    const resetGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameStatus("start");
    };

    if (gameStatus === "start") {
    return (
      <div className="start-screen">
        <h1>Välkommen till Whack-a-Mole!</h1>
        <label>
          Välj svårighetsgrad:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Lätt</option>
            <option value="medium">Medel</option>
            <option value="hard">Svår</option>
          </select>
        </label>
        <button onClick={() => setGameStatus("playing")}>Starta Spelet</button>
      </div>
    );
  }

  if (gameStatus === "gameover") {
    return (
      <div className="gameover-screen">
        <h1>Game Over!</h1>
        <p>Din poäng: {score}</p>
        <p>Highscore: {highScore}</p>
        <button onClick={resetGame}>Spela igen</button>
      </div>
    );
  }


  return (
    <div className="game-container">
      <h1>Whack-a-Mole</h1>
      <p>Poäng: {score}</p>
      <p>Tid kvar: {timeLeft} sekunder</p>
      <div className="grid">
        {holes.map((_, index) => (
          <div
            key={index}
            className={`hole ${activeMole === index ? "mole" : ""}`}
            onClick={() => handleClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WhackAMole;