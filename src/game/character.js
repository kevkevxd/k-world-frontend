import React, { Component } from "react";
import PropTypes from "prop-types";
import Matter from "matter-js";

import { AudioPlayer, Body, Sprite } from "react-game-kit";

export default class Character extends Component {
  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.loopID = null;
    this.isJumping = false;

    this.lastX = 0;

    this.state = {
      characterState: 2,
      loop: false,
      spritePlaying: true,
    };

    this.handlePlayStateChanged = this.handlePlayStateChanged.bind(this);
    this.jump = this.jump.bind(this);
    this.checkKeys = this.checkKeys.bind(this);
    this.update = this.update.bind(this);
    //.bind(this) gives them this prop in functional component
  }

  componentDidMount() {
    this.jumpNoise = new AudioPlayer("/assets/jump.wav");
    Matter.Events.on(this.context.engine, "afterUpdate", this.update);
  } //character will pin top left without it

  componentWillUnmount() {
    Matter.Events.off(this.context.engine, "afterUpdate", this.update);
  }

  getWrapperStyles() {
    const { characterPosition, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = characterPosition;
    const targetX = x + stageX;
    const targetY = y + 14;

    return {
      position: "absolute",
      // Translate is a CSS property that will move the container
      transform: `translate(${targetX * scale}px, ${targetY * scale}px)`,
      transformOrigin: "left top",
    };
  }

  render() {
    // this is accessing character position from gamestore through regular props
    // that are imported from gameIndex
    const x = this.props.store.characterPosition.x;

    return (
      <div style={this.getWrapperStyles()}>
        <Body
          args={[x, 384, 64, 64]}
          inertia={Infinity}
          ref={(b) => {
            this.body = b;
          }}
          label="Character"
        >
          <Sprite //current character selected
            repeat={this.state.repeat}
            onPlayStateChanged={this.handlePlayStateChanged}
            scale={this.context.scale * 1}
            state={this.state.characterState}
            steps={[5, 5, 1, 0, 0]}
            src={this.props.store.gameProfile.character_src}
          />
        </Body>
      </div>
    );
  }

  handlePlayStateChanged(state) {
    this.setState({
      spritePlaying: state ? true : false,
    });
  }

  move(body, x) {
    Matter.Body.setVelocity(body, { x, y: 0 });
  }

  jump(body) {
    this.jumpNoise.play();
    this.isJumping = true;
    Matter.Body.applyForce(body, { x: 0, y: 0 }, { x: 0, y: -0.15 }); //physics for moving sprite up and down
    Matter.Body.set(body, "friction", 0.0001);
  }

  checkKeys(shouldMoveStageLeft, shouldMoveStageRight) {
    const { keys, store } = this.props;
    const { body } = this.body;

    let characterState = 2;
    // Jump when you press space
    if (keys.isDown(keys.SPACE)) {
      this.jump(body);
    }

    // Move left or right
    if (keys.isDown(keys.LEFT)) {
      if (shouldMoveStageLeft) {
        store.setStageX(store.stageX + 5);
        store.checkIcecreamLoot();
        store.checkEnterPortal();
        store.checkdiceLoot();
        store.icecreamMonkeyPatch();
      }

      this.move(body, -5);
      characterState = 1;
    } else if (keys.isDown(keys.RIGHT)) {
      if (shouldMoveStageRight) {
        store.setStageX(store.stageX - 5);
        store.checkIcecreamLoot();
        store.checkdiceLoot();
        store.checkEnterPortal();
        store.icecreamMonkeyPatch();
      }

      this.move(body, 5);
      characterState = 0;
    }

    // Open portal when you press ctrl
    if (keys.isDown(keys.CTRL)) {
      store.openPortal();
    }

    this.setState({
      characterState,
      repeat: characterState < 2,
    });
  }

  update() {
    const { store } = this.props;
    const { body } = this.body;

    const midPoint = Math.abs(store.stageX) + 448;

    const shouldMoveStageLeft = body.position.x < midPoint && store.stageX < 0;
    const shouldMoveStageRight =
      body.position.x > midPoint && store.stageX > -2048;

    const velY = parseFloat(body.velocity.y.toFixed(10));

    if (velY === 0) {
      this.isJumping = false;
      Matter.Body.set(body, "friction", 0.9999);
    }

    // When character is moving or doing something
    if (!this.isJumping && !this.isLeaving) {
      this.checkKeys(shouldMoveStageLeft, shouldMoveStageRight);

      store.setCharacterPosition(body.position);
    } else {
      if (this.isJumping) {
        store.setCharacterPosition(body.position);
      }
      const targetX = store.stageX + (this.lastX - body.position.x);
      if (shouldMoveStageLeft || shouldMoveStageRight) {
        store.setStageX(targetX);
      }
    }

    this.lastX = body.position.x;
  }
}
