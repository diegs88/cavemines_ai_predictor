
import React, { useState } from "react";
import "./App.css";

function hashStringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateDeterministicGrid(seed, bombCount) {
  const grid = Array(25).fill("safe");
  let placed = 0;
  let attempt = 0;

  while (placed < bombCount && attempt < 1000) {
    const index = (seed + attempt * 31) % 25;
    if (grid[index] !== "mine") {
      grid[index] = "mine";
      placed++;
    }
    attempt++;
  }
  return grid;
}

function App() {
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [bombCount, setBombCount] = useState(5);
  const [seed, setSeed] = useState("example-seed");
  const [stake, setStake] = useState(10);
  const [revealed, setRevealed] = useState(false);

  const predict = () => {
    const numericSeed = hashStringToSeed(seed);
    const newGrid = generateDeterministicGrid(numericSeed, bombCount);
    setGrid(newGrid);
    setRevealed(false);
  };

  const reveal = () => {
    setRevealed(true);
  };

  return (
    <div className="app">
      <h1>🔮 CAVEMINES AI Predictor</h1>
      <div className="controls">
        <label>
          Client Seed:
          <input value={seed} onChange={(e) => setSeed(e.target.value)} />
        </label>
        <label>
          Stake:
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
        </label>
        <label>
          Bombs:
          <input
            type="number"
            value={bombCount}
            min={1}
            max={24}
            onChange={(e) => setBombCount(Number(e.target.value))}
          />
        </label>
        <button onClick={predict}>Predict Safe Spots</button>
        <button onClick={reveal}>Reveal</button>
      </div>
      <div className="grid">
        {grid.map((val, i) => (
          <div key={i} className={`tile ${revealed ? val : ""}`}>
            {revealed ? (val === "mine" ? "💣" : "✅") : "?"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
