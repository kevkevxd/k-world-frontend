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
import Background from './Background';

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
      shouldAnimateBackground: false,
      characterFacing: "right",

      // game store
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
        icecreamPosition: { x: icecreamSpawnLocation, y: 376 },
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
        this.state.icecreamIndex >= 1 && this.setState({ shouldAnimateBackground: !this.state.shouldAnimateBackground })
        break;
      case "2":
        // this.state.icecreamIndex >= 2 &&
        break;
      case "3":
        // this.state.icecreamIndex >= 3 &&
        break;
      case "4":
        // this.state.icecreamIndex >= 4 &&
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
  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

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

      setStageX: this.setStageX,
      openPortal: this.openPortal,
      closePortal: this.closePortal,
      setCharacterPosition: this.setCharacterPosition,
      checkEnterPortal: this.checkEnterPortal,
      checkIcecreamLoot: this.checkIcecreamLoot,
    };
    // pass in state here after eating icecream
    return (
      <>
        <Background image={this.state.papers[this.state.backgroundIndex]} shouldAnimateBackground={this.state.shouldAnimateBackground} />
        <Loop>
          <Stage>
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
