import React from "react";
import Game from "./Game";
class GameBoard extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <Game rows={5} columns={5} />
      </div>
    );
  }
}
export default GameBoard;
