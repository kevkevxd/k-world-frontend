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

  // static iceCreamColors = ["red", "yellow", "blue", "green", "black"];

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
      icecreamPosition: { x: 500, y: 320 }, //change y to character y
      isPortalOpen: false,
      isIcecreamThere: false,
    };
  }

  physicsInit(engine) {
    //adds barriers to our game
    const ground = Matter.Bodies.rectangle(512 * 3, 520, 1024 * 3, 64, {
      isStatic: true,
    });

    const leftWall = Matter.Bodies.rectangle(-88, 288, 64, 1000, {
      isStatic: true,
    });

    const rightWall = Matter.Bodies.rectangle(3100, 288, 64, 1000, {
      isStatic: true,
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
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
    this.setState({
      isPortalOpen: false,
      fade: true,
    });
    setTimeout(() => {
      this.bgRandomizer();
    }, 680);
    setTimeout(() => {
      this.icecreamSpawner();
    }, 1970);
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
    const min = 500;
    const max = 2500;
    const icecreamSpawnLocation = Math.floor(Math.random() * (max - min) + min);
    const icecreamSpawnChance = Math.round(Math.random() * 10);
    if (icecreamSpawnChance >= 5) {
      this.setState({
        isIcecreamThere: true,
        icecreamPosition: { x: icecreamSpawnLocation, y: 320 },
      });
    }
  };

  patchRequest = (patchIcecreamObj, id) => {
    // fetch(url, {
    //   body: {...patchIcecreamObj,
    // make sure you pass in the current user data
    // id: this.state.user.id
    // username: this.state.user.username},
    // }).then(
    // )
  }

  patchIcecream = () => {
      // switch statement here. icecream index = what goes inside of post
      const iceIndex = this.state.icecreamIndex;
      switch(iceIndex) {
        // The first ice cream is red
        case 0:
          this.patchRequest({ has_red_icecream: true });
          break;
        // case 1:
        // this.patchRequest({ has_red_icecream: true })
        //   break;
        // case 2:
        // this.patchRequest({ has_blue_icecream: true })
        //   break;
        // case 3:
        // this.patchRequest({ has_yellow_icecream: true })
        //   break;
        // case 4:
        // this.patchRequest({ has_green_icecream: true })
        //   break;
        // case 5:
        // this.patchRequest({ has_black_icecream: true })
        //   break;
        // default:
        //   // code block
    }
  };

  checkIcecreamLoot = () => {
    if (
      this.state.characterPosition.x >= this.state.icecreamPosition.x - 24 &&
      this.state.characterPosition.x <= this.state.icecreamPosition.x + 24
    ) {
      this.setState({
        isIcecreamThere: false,
      });
      // this.patchIcecream();
    }
  }

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

    fetch("http://localhost:5003/wallpapers")
      .then((res) => res.json())
      .then((data) => { 
        const papers = data.map((paper) => paper.source);
        this.setState({
          papers, // same as papers: papers (only works when its the same name)
          backgroundIndex: Math.round(Math.random() * papers.length),
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isIcecreamThere === true &&
      this.state.isIcecreamThere === false &&
      // the next one will be 4 which is the last index
      this.state.icecreamIndex <= 3
    ) {
      this.setState({ icecreamIndex: this.state.icecreamIndex + 1 });
    }
  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

  bgRandomizer = () => {
    const papers = this.state.papers;

    this.setState({
      backgroundIndex: Math.round(Math.random() * papers.length),
      fade: false,
    });
  };

  render() {

    const GameStore = {
      portalPosition: this.state.portalPosition,
      stageX: this.state.stageX,
      characterPosition: this.state.characterPosition,
      isPortalOpen: this.state.isPortalOpen,
      icecreamPosition: this.state.icecreamPosition,
      isIcecreamThere: this.state.isIcecreamThere,
      icecreamIndex: this.state.icecreamIndex,
      
      setStageX: this.setStageX,
      openPortal: this.openPortal,
      closePortal: this.closePortal,
      setCharacterPosition: this.setCharacterPosition,
      checkEnterPortal: this.checkEnterPortal,
      checkIcecreamLoot: this.checkIcecreamLoot,
      lootIcecream: this.lootIcecream,
      gameProfile: this.props.gameProfile,
    };
 
    return (
      <Loop>
        <Stage
          style={{
            background: `url(${
              this.state.papers[this.state.backgroundIndex]
            }&w=1400&fit=max) center / cover no-repeat`,
          }}
        >
          <World
            onInit={this.physicsInit}
            // onCollision={(param) => {
            
            // }}
          >
            <Level
              store={GameStore}
              currentPaper={this.state.papers[this.state.backgroundIndex]}
            />
            <Character store={GameStore} keys={this.keyListener} />
            <Portal store={GameStore} />
            <Icecream
              store={GameStore}
              currentIndex={this.state.icecreamIndex}
            />
          </World>
        </Stage>
        <Fade visible={this.state.fade} />
      </Loop>
      
    );
  }
}
