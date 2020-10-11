import React, { Component } from "react";
import PropTypes from "prop-types";
import Matter from "matter-js";

import { AudioPlayer, Loop, Stage, World } from "react-game-kit";
import Portal from "./Portal";
import Character from "./character";
import Level from "./level";
import Fade from "./fade";

import KeyListener from "../utils/key-listener";

export default class Game extends Component {
  static propTypes = {
    onLeave: PropTypes.func,
  };

  constructor() {
    super();
    this.keyListener = new KeyListener();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = window.context || new AudioContext();

    this.state = {
      fade: true,
      papers: [],
      backgroundIndex: 0,
      currentPaper: "url",

      // game store
      characterPosition: { x: 0, y: 0 },
      stageX: 0,
      portalPosition: { x: 0, y: 0 },
      isPortalOpen: false,
    };

    this.handleEnterBuilding = this.handleEnterBuilding.bind(this);
  }

  // Setting state in game store
  setCharacterPosition = (position) => {
    this.setState({
      characterPosition: position,
    });
  };

  setStageX = (x) => {
    let stageX;
    //movement gets stuck w/o this
    if (x > 0) {
      stageX = 0;
    } else if (x < -2048) {
      stageX = -2048;
    } else {
      stageX = x;
    }
    this.setState({
      stageX,
    });
  };

  setPortalPosition = (position) => {
    this.setState({
      portalPosition: position,
    });
  };

  openPortal = () => {
    const newPortalPosition = {
      x: this.state.characterPosition.x + 500,
      y: this.state.characterPosition.y - 40,
    };

    this.setPortalPosition(newPortalPosition);

    this.setState({
      isPortalOpen: true,
    });
  };

  closePortal = () => {
    this.setState({
      isPortalOpen: false,
    });
  };

  checkEnterPortal = () => {
    if (
      this.state.characterPosition.x >= this.state.portalPosition.x - 20 &&
      this.state.characterPosition.x <= this.state.portalPosition.x + 20
    ) {
      this.closePortal();
    }
  };

  //base music
  componentDidMount() {
    this.player = new AudioPlayer("/assets/ellinia.wav", () => {
      this.stopMusic = this.player.play({
        loop: true,
        offset: 1,
        volume: 0,
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
      this.keyListener.A,
      this.keyListener.CTRL,
    ]);

    fetch("http://localhost:5005/ocean_papers")
      .then((res) => res.json())
      .then((data) => {
        const papers = data.map((paper) => paper.source);
        this.setState({
          papers, // same as papers: papers (only works when its the same name)
          backgroundIndex: Math.round(Math.random() * papers.length),
        });
      });
  }

  // componentWillUnmount() {
  //   this.stopMusic();
  //   this.keyListener.unsubscribe();
  // }

  bgRandomizer = () => {
    const papers = this.state.papers;
    const randomPaperNum = Math.round(Math.random() * papers.length);
  };

  render() {
    const GameStore = {
      portalPosition: this.state.portalPosition,
      stageX: this.state.stageX,
      characterPosition: this.state.characterPosition,
      isPortalOpen: this.state.isPortalOpen,

      setStageX: this.setStageX,
      openPortal: this.openPortal,
      closePortal: this.closePortal,
      setCharacterPosition: this.setCharacterPosition,
      checkEnterPortal: this.checkEnterPortal,
    };

    return (
      <Loop>
        <Stage style={{ background: "#3a9bdc" }}>
          <World
            onInit={this.physicsInit}
            onCollision={(param) => {
              console.log("onCollision");
              console.log(param);
            }}
          >
            <Level
              store={GameStore}
              currentPaper={this.state.papers[this.state.backgroundIndex]}
            />
            <Character
              onEnterBuilding={this.handleEnterBuilding}
              store={GameStore}
              keys={this.keyListener}
            />
            <Portal store={GameStore} />
          </World>
        </Stage>
        <Fade visible={this.state.fade} />
      </Loop>
    );
  }

  //onCollision(engine) {

  // }

  physicsInit(engine) {
    //adds barriers to our game
    const ground = Matter.Bodies.rectangle(512 * 3, 448, 1024 * 3, 64, {
      isStatic: true,
    });

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true,
    });

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true,
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  }

  handleEnterBuilding(index) {
    this.setState({
      fade: true,
    });
    setTimeout(() => {
      // this.props.onLeave(index);
    }, 500);
  }
}
