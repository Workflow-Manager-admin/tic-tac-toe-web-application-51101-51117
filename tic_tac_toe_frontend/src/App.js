import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Game colors and style config
 * -- Provided color scheme via CSS Variables in :root
 * primary:   #1976d2
 * secondary: #424242
 * accent:    #ff4081
 */

// PUBLIC_INTERFACE
function App() {
  // State for the 3x3 tic tac toe board (array of 9; 'X', 'O', or null)
  const [board, setBoard] = useState(Array(9).fill(null));
  // State for tracking if X is next turn
  const [xIsNext, setXIsNext] = useState(true);
  // State for game over/winner
  const [winner, setWinner] = useState(null);
  // State for whether board is full (draw)
  const [isDraw, setIsDraw] = useState(false);

  // Evaluate game status when board changes
  useEffect(() => {
    const win = calculateWinner(board);
    setWinner(win);

    if (!win && board.every((cell) => cell !== null)) {
      setIsDraw(true);
    } else {
      setIsDraw(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  /**
   * Handles a move when a user clicks a board square
   * @param {number} idx - index of square clicked
   */
  const handleClick = (idx) => {
    if (board[idx] || winner) return; // Ignore if filled or game over
    const newBoard = [...board];
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  /**
   * Restart the game by resetting board and state
   */
  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
  };

  // Compute status message
  let status;
  if (winner) {
    status = (
      <span style={{ color: "var(--accent)" }}>
        Winner: {winner === "X" ? "X" : "O"} 🎉
      </span>
    );
  } else if (isDraw) {
    status = (
      <span style={{ color: "var(--secondary)" }}>
        It's a draw! 🤝
      </span>
    );
  } else {
    status = (
      <>
        Next turn:{" "}
        <span style={{ color: xIsNext ? "var(--primary)" : "var(--accent)", fontWeight: 600 }}>
          {xIsNext ? "X" : "O"}
        </span>
      </>
    );
  }

  // Render board squares
  function renderSquare(idx) {
    return (
      <button
        className={`ttt-square${board[idx] ? " filled" : ""}`}
        onClick={() => handleClick(idx)}
        style={
          board[idx]
            ? {
                color:
                  board[idx] === "X"
                    ? "var(--primary)"
                    : "var(--accent)",
              }
            : {}
        }
        aria-label={`Square ${idx % 3 + 1}, ${Math.floor(idx / 3) + 1}`}
      >
        {board[idx]}
      </button>
    );
  }

  return (
    <div className="App" style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <div className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" data-testid="game-status">
          {status}
        </div>
        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {[0, 1, 2].map((row) => (
            <div className="ttt-board-row" key={row}>
              {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
            </div>
          ))}
        </div>
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart game"
        >
          Restart Game
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          Made with <span style={{ color: "var(--accent)", fontWeight: "bold" }}>♥</span> using React
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Calculate the winner of the tic tac toe board.
 * @param {array} squares - The board state array (length 9)
 * @returns {"X"|"O"|null}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
