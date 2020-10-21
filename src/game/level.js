import React, { Component } from "react";
import PropTypes from "prop-types";
import { autorun } from "mobx";

import { TileMap } from "react-game-kit";
import Background from './Background';

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

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
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
      width: '100%',
      height: '100%',
    };
  }

  render() {
    const columns = 41;
    return (
      <div style={this.getWrapperStyles()}>
        <Background
          image={this.props.image}
          shouldAnimateBackground={this.props.shouldAnimateBackground}
          shouldTwisty={this.props.shouldTwisty}
        />
        <TileMap
          style={{ top: Math.floor(64 * this.context.scale), opacity: 0.25 }}
          src="assets/Space.png"
          tileSize={76}
          columns={columns}
          rows={7}
          layers={[
            [
              ...(new Array(columns * 6).fill(0)),
              ...(new Array(columns).fill(1)),
            ]
          ]}
        />
      </div>
    );
  }
}
