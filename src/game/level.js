import React, { Component } from "react";
import PropTypes from "prop-types";
import { autorun } from "mobx";

import { TileMap } from "react-game-kit";

import GameStore from "./stores/game-store";

export default class Level extends Component {
  static contextTypes = {
    scale: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      stageX: 0,
    };
  }

  componentDidMount() {
    //character will get stuck at the first building w/o this
    this.cameraWatcher = autorun(() => {
      const targetX = Math.round(GameStore.stageX * this.context.scale);
      this.setState({
        stageX: targetX,
      });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const targetX = Math.round(GameStore.stageX * nextContext.scale);
    this.setState({
      stageX: targetX,
    });
  }

  componentWillUnmount() {
    this.cameraWatcher();
  }

  getWrapperStyles() {
    return {
      position: "absolute",
      transform: `translate(${this.state.stageX}px, 0px) translateZ(0)`,
      transformOrigin: "top left",
    };
  }

  render() {
    console.log(apikey);
    const pretendWorkingApiPull =
      "https://images.unsplash.com/photo-1532891463981-a5b6ca49f344?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&h=512&w=3072&fit=crop&ixid=eyJhcHBfaWQiOjE3MjgzNH0";
    return (
      <div style={this.getWrapperStyles()}>
        <TileMap
          style={{ top: Math.floor(64 * this.context.scale) }}
          src="assets/Space.png"
          tileSize={128}
          columns={24}
          rows={4}
          layers={[
            [
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
            ],
          ]}
        />
        <TileMap
          style={{ top: Math.floor(-63 * this.context.scale) }}
          src={pretendWorkingApiPull}
          rows={1}
          columns={6}
          tileSize={512}
          layers={[[1, 2, 3, 4, 5, 6]]}
        />
      </div>
    );
  }
}
