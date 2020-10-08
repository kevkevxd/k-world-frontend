import React from "react";
import PropTypes from "prop-types";
// import Matter from "matter-js";
import Character from "../../views/home/character";

import { AudioPlayer, Loop, Stage, KeyListener, World } from "react-game-kit";

class Engine extends React.component {
  static propTypes = {
    onLeave: PropTypes.func,
  };

  componentDidMount() {
    this.player = new AudioPlayer("/assets/Satellite.wav", () => {
      this.stopMusic = this.player.play({
        loop: true,
        offset: 1,
        volume: 0.35,
      });
    });

    this.setState({
      fade: false,
    });

    this.keyListener.subscribe([
      this.keyListener.LEFT,
      this.keyListener.RIGHT,
      this.keyListener.UP,
      this.keyListener.SPACE,
      65,
    ]);
  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

  render() {
    return (
      <Loop>
        <Stage>
          <World>
            {/* <Level store={GameStore} /> */}
            <Character
            // onEnterBuilding={this.handleEnterBuilding}
            // store={GameStore}
            // keys={this.keyListener}
            />
          </World>
        </Stage>
      </Loop>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      fade: true,
    };
    this.keyListener = new KeyListener();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = window.context || new AudioContext();

    this.handleEnterBuilding = this.handleEnterBuilding.bind(this);
  }
}

export default Engine;
