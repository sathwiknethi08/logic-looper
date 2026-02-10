import React, { useState, useEffect } from "react";

export default function PuzzleBoard() {
  const [grid, setGrid] = useState([]);
  const [time, setTime] = useState(0);


 useEffect(() => {
  const savedGrid = localStorage.getItem("savedGrid");
  const savedTime = localStorage.getItem("savedTime");

  if (savedGrid) setGrid(JSON.parse(savedGrid));
  else generatePuzzle();

  if (savedTime) setTime(Number(savedTime));

  const interval = setInterval(() => {
    setTime((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);


  // Daily Puzzle Generator (based on date)
  function generatePuzzle() {
    const today = new Date().toDateString();
    let seed = 0;

    for (let i = 0; i < today.length; i++) {
      seed = today.charCodeAt(i) + ((seed << 5) - seed);
    }

    const size = 4;
    const puzzle = [];

    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(((seed + i + j) % 4) + 1);
      }
      puzzle.push(row);
    }

    setGrid(puzzle);
  }

  // Handle user input
  function handleChange(r, c, value) {
  const newGrid = [...grid];
  newGrid[r][c] = Number(value);
  setGrid(newGrid);

  localStorage.setItem("savedGrid", JSON.stringify(newGrid));
  localStorage.setItem("savedTime", time);
}

  // Validate solution
  function checkSolution() {
    const size = grid.length;

    for (let i = 0; i < size; i++) {
      let row = new Set();
      let col = new Set();

      for (let j = 0; j < size; j++) {
        if (row.has(grid[i][j]) || col.has(grid[j][i])) {
          alert("Wrong ❌");
          return;
        }
        row.add(grid[i][j]);
        col.add(grid[j][i]);
      }
    }

    updateStreak();
    alert(`Correct 🎉 Time: ${time} sec`);
  }

  // Streak system
  function updateStreak() {
    const today = new Date().toDateString();
    const last = localStorage.getItem("lastPlayed");
    let streak = Number(localStorage.getItem("streak") || 0);

    if (last === today) return;

    const y = new Date();
    y.setDate(y.getDate() - 1);

    if (last === y.toDateString()) streak++;
    else streak = 1;

    localStorage.setItem("streak", streak);
    localStorage.setItem("lastPlayed", today);
  }

  return (
    <div>
      <h2>Daily Puzzle</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 60px)",
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              value={cell}
              onChange={(e) => handleChange(r, c, e.target.value)}
              style={{ width: "60px", height: "60px", textAlign: "center" }}
            />
          ))
        )}
      </div>

      <button onClick={checkSolution} style={{ marginTop: "10px" }}>
        Check Solution
      </button>

      <p>🔥 Streak: {localStorage.getItem("streak") || 0}</p>
    </div>
  );
}
