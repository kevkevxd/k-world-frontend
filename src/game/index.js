import React, { Component } from "react";
import PropTypes from "prop-types";
import Matter from "matter-js";
import Icecream from "./icecream";
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
      icecreamIndex: 0,
      currentPaper: "url",

      // game store
      characterPosition: { x: 0, y: 0 },
      stageX: 0,
      portalPosition: { x: 0, y: 0 },
      icecreamPosition: { x: 500, y: 220 },
      isPortalOpen: false,
      isIcecreamThere: false,
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

  //// portal behavior ////////////////////////////////////
  setPortalPosition = (position) => {
    this.setState({
      portalPosition: position,
    });
  };

  openPortal = () => {
    const newPortalPosition = {
      x: this.state.characterPosition.x + 250,
      y: this.state.characterPosition.y - 40,
    };

    this.setPortalPosition(newPortalPosition);

    this.setState({
      isPortalOpen: true,
    });
  };

  closePortal = () => {
    console.log("closePortal");
    this.setState({
      isPortalOpen: false,
    });
    this.bgRandomizer();
    this.icecreamSpawner();
  };

  checkEnterPortal = () => {
    if (
      this.state.characterPosition.x >= this.state.portalPosition.x - 20 &&
      this.state.characterPosition.x <= this.state.portalPosition.x + 20 &&
      this.state.isPortalOpen
    ) {
      this.closePortal();
    }
  };
  icecreamSpawner = () => {
    const icecreamIndex = Math.round(Math.random() * 10);
    if (icecreamIndex >= 1) {
      this.setState({ isIcecreamThere: true });
    }
  };

  checkIcecreamLoot = () => {
    if (
      this.state.characterPosition.x >= this.state.icecreamPosition.x - 20 &&
      this.state.characterPosition.x <= this.state.icecreamPosition.x + 20
    ) {
      this.lootIcecream();
      this.setState({ isIcecreamThere: false });
    }
  };

  lootIcecream = () => {
    console.log("icecream looted");
    //make icecream dissappear.
    //make it appear in bag => send to backend + hold bag state.
  };
  //////////////////////////////////////////////////////////
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

    fetch("http://localhost:5000/space_papers")
      .then((res) => res.json())
      .then((data) => {
        const papers = data.map((paper) => paper.source);
        this.setState({
          papers, // same as papers: papers (only works when its the same name)
          backgroundIndex: Math.round(Math.random() * papers.length),
        });
      });
  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

  bgRandomizer = () => {
    const papers = this.state.papers;

    this.setState({
      backgroundIndex: Math.round(Math.random() * papers.length),
    });
  };

  render() {
    // console.log(this.state.characterPosition);
    // console.log(this.state.icecreamPosition);
    const GameStore = {
      portalPosition: this.state.portalPosition,
      stageX: this.state.stageX,
      characterPosition: this.state.characterPosition,
      isPortalOpen: this.state.isPortalOpen,
      icecreamPosition: this.state.icecreamPosition,
      isIcecreamThere: this.state.isIcecreamThere,

      setStageX: this.setStageX,
      openPortal: this.openPortal,
      closePortal: this.closePortal,
      setCharacterPosition: this.setCharacterPosition,
      checkEnterPortal: this.checkEnterPortal,
      checkIcecreamLoot: this.checkIcecreamLoot,
      lootIcecream: this.lootIcecream,
    };

    return (
      <Loop>
        <Stage
          style={{
            background: `url(${
              this.state.papers[this.state.backgroundIndex]
            }) center / cover no-repeat`,
          }}
        >
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
            <Icecream store={GameStore} />
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

    const leftWall = Matter.Bodies.rectangle(-80, 288, 64, 576, {
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
