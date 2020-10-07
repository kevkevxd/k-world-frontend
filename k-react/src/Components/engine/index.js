import React, { useState, useEffect } from "react";
import styles from "./engine.module.scss";
import { useEvent } from "../../hooks";

function CreateEngine(setState) {
  this.settings = {
    tile: 100, // width of one tile
  };

  // current stage position
  this.stage = 0;

  // function that will be continuously ran
  this.repaint = () => {
    // move the stage by one tile
    this.stage += this.settings.tile;

    // set state for use in the component
    setState({ stage: this.stage });

    // start repaint on next frame
    return requestAnimationFrame(this.repaint);
  };

  // trigger initial paint
  this.repaint();
  return () => ({});
}

export default function Engine() {
  // game state
  const [gameState, setGameState] = useState({ stage: 0 });

  // trigger game to start
  const [start, setStart] = useState(false);

  // if game is running
  const [started, setStarted] = useState(false);

  // instance of game engine
  const [engine, setEngine] = useState(null);

  const handleKeyPress = (e) => {
    // the ' ' char actually represents the space bar key.
    if (e.key === " ") {
      // start the game when the user first presses the spacebar
      if (!started && !start) {
        setStart(true);
      }

      // if the game has not been initialized return
      if (engine === null) return;

      // otherwise jump
      // engine.jump();
    }
  };

  useEvent("keyup", handleKeyPress);

  useEffect(() => {
    if (start) {
      setStarted(true);
      setStart(false);
      // create a new engine and save it to the state to use
      setEngine(
        new CreateEngine(
          // set state
          (state) => setGameState(state)
        )
      );
    }
  });

  return (
    <div className={styles.container}>
      <div
        className={styles.stage}
        style={{
          transform: `translate(${gameState.stage}px, 0px)`, // move stage
        }}
      >
        <span
          className={styles.character}
          style={{
            transform: `translate(-${gameState.stage}px, 0px)`, // move char in opposite direction
          }}
        />
      </div>
    </div>
  );
}
