import React, { Component } from "react";
import PropTypes from "prop-types";
import Matter from "matter-js";
import Icecream from "./icecream";
import { AudioPlayer, Loop, Stage, World } from "react-game-kit";
import Portal from "./Portal";
import Character from "./character";
import Level from "./level";
import Fade from "./fade";
import Pet from "./Pet"
import IcecreamUI from "./icecreamUI"
import KeyListener from "../utils/key-listener";
import Clock from '../clock'
import Dice from "./Dice"

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
      fullPaper: {},
      shouldRGB: false,
      shouldTwisty: false,
      shouldReflect: false,
      shouldRadial: false,

      isGrindDiceThere: false,
      isNobloomDiceThere: false,
      isCirclesDiceThere: false,
      isTempDiceThere: false,
      dicemap: null,

      grindDicePosition: { x: 0, y: 0, },
      nobloomDicePosition: { x: 0, y: 0, },
      circlesDicePosition: { x: 0, y: 0, },
      tempDicePosition: { x: 0, y: 0, },
      dicePortalIndex: 0,

      // game store
      characterFacing: "right",
      characterPosition: { x: 0, y: 0 },
      stageX: 0,
      portalPosition: { x: 0, y: 0 },
      icecreamPosition: { x: 500, y: 320 }, //change y to character y in icecreamspawner()
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
      x: this.state.characterPosition.x + 230,
      y: this.state.characterPosition.y - 25,
    };

    const newPortalLeft = {
      x: this.state.characterPosition.x - 230,
      y: this.state.characterPosition.y - 25,
    }

    this.state.characterFacing === "right" ?
      this.setPortalPosition(newPortalPosition) :
      this.setPortalPosition(newPortalLeft)

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
    setTimeout(() => {
      this.diceSpawner();
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
        icecreamPosition: { x: icecreamSpawnLocation, y: this.state.characterPosition.y - 60, },
      });
    }
  };

  patchRequest = (icecream) => {
    fetch(`http://localhost:5003/users/${this.props.gameProfile.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
      },
      body: JSON.stringify(icecream),
    })
      .then((res) => res.json())
      .then((newobj => {
        this.props.newCreamState(newobj)
      }))
  }

  patchIcecream = () => {
    // switch statement here. icecream index = what goes inside of post
    const iceIndex = this.state.icecreamIndex;

    switch (iceIndex) {
      // The first ice cream is red
      case 0:
        this.patchRequest({ has_red_icecream: true });
        break;
      case 1:
        this.patchRequest({ has_yellow_icecream: true })
        break;
      case 2:
        this.patchRequest({ has_blue_icecream: true })
        break;
      case 3:
        this.patchRequest({ has_green_icecream: true })
        break;
      case 4:
        this.patchRequest({ has_black_icecream: true })
        break;
      default:
      // code block
    }
  };

  icecreamSpawnIndex = () => {
    // switch statement here. icecream index = what goes inside of post
    const user = this.props.gameProfile;
    switch (true) {
      case user.has_red_icecream:
        this.setState({ icecreamIndex: 1 })

      case user.has_yellow_icecream:
        this.setState({ icecreamIndex: 2 })

      case user.has_blue_icecream:
        this.setState({ icecreamIndex: 3 })

      case user.has_green_icecream:
        this.setState({ icecreamIndex: 4 })

      case user.has_black_icecream:
        this.setState({ icecreamIndex: 5 })
        break;

      // code block
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
    }
  }
  icecreamMonkeyPatch = () => {
    if (
      this.props.gameProfile.has_red_icecream && !this.props.gameProfile.has_black_icecream && this.state.icecreamIndex === 5
    ) {
      this.setState({
        icecreamIndex: 2
      });
    }
  }
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

    this.icecreamSpawnIndex()
    console.log(this.state.icecreamIndex)
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
        const fullPaper = data.map((paper) => paper)
        this.setState({
          papers, // same as papers: papers (only works when its the same name)
          backgroundIndex: Math.round(Math.random() * papers.length),
          fullPaper,
        });
      });

    document.addEventListener("keydown", this.otherKeyListener);
  }

  otherKeyListener = (event) => {
    const paperArray = this.state.fullPaper
    const index = this.state.backgroundIndex
    switch (event.key) {
      // The first ice cream is red
      case "1":
        // this.state.icecreamIndex >= 1 && 
        this.setState({ shouldRGB: !this.state.shouldRGB })
        break;
      case "2":
        // this.state.icecreamIndex >= 2 && 
        this.setState({ shouldTwisty: !this.state.shouldTwisty })
        console.log("twisty")
        break;
      case "3":
        // this.state.icecreamIndex >= 3 &&
        this.setState({ shouldReflect: !this.state.shouldReflect })
        console.log("wavey")
        break;
      case "4":
        // this.state.icecreamIndex >= 4 &&
        this.setState({ shouldRadial: !this.state.shouldRadial })
        console.log("radial")
        break;
      case "5":
        // this.state.icecreamIndex >= 4 &&
        this.setState({
          shouldRGB: false,
          shouldTwisty: false,
          shouldReflect: false,
          shouldRadial: false,
        })
        console.log("stopping all filters")
        break;

      case "d":
        console.log("d:", paperArray[index])
        this.deleteCurrentPaper(paperArray[index])
        break;
      case "ArrowRight":
        console.log("right")
        this.setState({ characterFacing: "right" })
        break;
      case "ArrowLeft":
        console.log("left")
        this.setState({ characterFacing: "left" })
        break;
      case "0":
        console.log("portal closed")
        this.setState({ isPortalOpen: false })
        break;
      default:

    }
  };

  bgRandomizer = () => {
    const papers = this.state.papers;
    this.setState({
      backgroundIndex: Math.round(Math.random() * papers.length),
      fade: false,
    });
  };

  deleteCurrentPaper = (paper) => {
    fetch(`http://localhost:5003/wallpapers/${paper.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
      },
      body: JSON.stringify(paper),
    })
      .then((res) => res.json())
      .then(() => {
        const papers = this.state.papers.filter(
          currentObj => paper.id !== currentObj.id
        );

        this.setState({
          papers,
        });
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.isIcecreamThere === true &&
      this.state.isIcecreamThere === false &&
      // the next one will be 4 which is the last index
      this.state.icecreamIndex <= 4
    ) {
      this.setState({ icecreamIndex: this.state.icecreamIndex + 1 });
      this.patchIcecream();
    }
    if (
      prevState.isPortalOpen === true &&
      this.state.isPortalOpen === false &&
      this.props.gameProfile.username === "victor"
    ) {
      this.setState({ dicePortalIndex: this.state.dicePortalIndex + 1 });
    }

  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

  diceSpawner = () => {
    const min = 500;
    const max = 2500;
    const diceSpawnLocation0 = Math.floor(Math.random() * (max - min) + min);
    const diceSpawnLocation1 = Math.floor(Math.random() * (max - min) + min);
    const diceSpawnLocation2 = Math.floor(Math.random() * (max - min) + min);
    const diceSpawnLocation3 = Math.floor(Math.random() * (max - min) + min);
    // const diceSpawnChance = Math.round(Math.random() * 10);
    if (this.state.dicePortalIndex === 1) {
      this.setState({
        isNobloomDiceThere: true,
        isTempDiceThere: true,
        isCirclesDiceThere: true,
        isGrindDiceThere: true,
        grindDicePosition: { x: diceSpawnLocation0, y: this.state.characterPosition.y - 5, },
        nobloomDicePosition: { x: diceSpawnLocation1, y: this.state.characterPosition.y - 5, },
        circlesDicePosition: { x: diceSpawnLocation2, y: this.state.characterPosition.y - 5, },
        tempDicePosition: { x: diceSpawnLocation3, y: this.state.characterPosition.y - 5, },
      });
    }
  };

  checkdiceLoot = () => {
    if (this.state.characterPosition.x >= this.state.grindDicePosition.x - 24 &&
      this.state.characterPosition.x <= this.state.grindDicePosition.x + 24) {
      this.setState({ isGrindDiceThere: false });
      console.log("i pikup")
    }
    if (this.state.characterPosition.x >= this.state.nobloomDicePosition.x - 24 &&
      this.state.characterPosition.x <= this.state.nobloomDicePosition.x + 24) {
      this.setState({ isNobloomDiceThere: false });
      console.log("i pikup")
    }
    if (this.state.characterPosition.x >= this.state.circlesDicePosition.x - 24 &&
      this.state.characterPosition.x <= this.state.circlesDicePosition.x + 24) {
      this.setState({ isCirclesDiceThere: false });
      console.log("i pikup")
    }
    if (this.state.characterPosition.x >= this.state.tempDicePosition.x - 24 &&
      this.state.characterPosition.x <= this.state.tempDicePosition.x + 24) {
      this.setState({ isTempDiceThere: false });
      console.log("i pikup")
    }

  };
  //////////////////////////////////////////////////////////

  render() {

    const GameStore = {
      portalPosition: this.state.portalPosition,
      stageX: this.state.stageX,
      characterFacing: this.state.characterFacing,
      characterPosition: this.state.characterPosition,
      isPortalOpen: this.state.isPortalOpen,
      icecreamPosition: this.state.icecreamPosition,
      isIcecreamThere: this.state.isIcecreamThere,
      icecreamIndex: this.state.icecreamIndex,
      lootIcecream: this.lootIcecream,
      gameProfile: this.props.gameProfile,
      icecreamMonkeyPatch: this.icecreamMonkeyPatch,

      image: this.state.papers[this.state.backgroundIndex],
      currentPaper: this.state.papers[this.state.backgroundIndex],
      shouldRGB: this.state.shouldRGB,
      shouldTwisty: this.state.shouldTwisty,
      shouldReflect: this.state.shouldReflect,
      shouldRadial: this.state.shouldRadial,

      grindDicePosition: this.state.grindDicePosition,
      nobloomDicePosition: this.state.nobloomDicePosition,
      circlesDicePosition: this.state.circlesDicePosition,
      tempDicePosition: this.state.tempDicePosition,
      isGrindDiceThere: this.state.isGrindDiceThere,
      isNobloomDiceThere: this.state.isNobloomDiceThere,
      isCirclesDiceThere: this.state.isCirclesDiceThere,
      isTempDiceThere: this.state.isTempDiceThere,
      dicemap: this.state.dicemap,
      dicePortalIndex: this.state.dicePortalIndex,

      setStageX: this.setStageX,
      openPortal: this.openPortal,
      closePortal: this.closePortal,
      setCharacterPosition: this.setCharacterPosition,
      checkEnterPortal: this.checkEnterPortal,
      checkIcecreamLoot: this.checkIcecreamLoot,
      checkdiceLoot: this.checkdiceLoot
    };
    // pass in state here after eating icecream
    return (
      <>
        <Clock />
        <Loop>
          <Stage>
            <World
              onInit={this.physicsInit}
            >
              <Level
                store={GameStore}
              />
              <Dice store={GameStore} />
              <Character store={GameStore} keys={this.keyListener} />
              <Pet store={GameStore} />
              <Portal store={GameStore} />
              <Icecream
                store={GameStore}
                currentIndex={this.state.icecreamIndex}
              />
              <IcecreamUI store={GameStore} />
            </World>
          </Stage>
          <Fade visible={this.state.fade} />
        </Loop>
      </>
    );
  }
}
