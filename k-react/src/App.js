import React from "react";
import "./App.css";
import GameBoard from "./Board/GameBoard.js";
function App() {
  return (
    <div className="App">
      <header className="board">
        <GameBoard />
      </header>
    </div>
  );
}

export default App;
