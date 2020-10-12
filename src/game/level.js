import React, { Component } from "react";
import PropTypes from "prop-types";
import { autorun } from "mobx";

import { TileMap } from "react-game-kit";

const apikey = process.env.REACT_APP_ACCESS_APIKEY;

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
      const targetX = Math.round(this.props.store.stageX * this.context.scale);
      this.setState({
        stageX: targetX,
      });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const targetX = Math.round(this.props.store.stageX * nextContext.scale);
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
    return (
      <div style={this.getWrapperStyles()}>
        <TileMap
          style={{ top: Math.floor(64 * this.context.scale) }}
          src="assets/Space.png"
          tileSize={128}
          columns={24}
          rows={1}
          layers={[
            [
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
      </div>
    );
  }
}
