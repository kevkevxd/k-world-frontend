import React from "react";
import PropTypes from "prop-types";
import { Body, Sprite } from "react-game-kit";

class Pet extends React.Component {
  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  getWrapperStyles() {
    const { characterPosition, stageX, characterFacing } = this.props.store;
    const { scale } = this.context;
    const { x, y } = characterPosition;
    const targetX = characterFacing === "right" ? x + stageX - 29 : x + stageX + 48
    const targetY = y - 1;

    return {
      position: "absolute",
      // Translate is a CSS property that will move the container
      transform: `translate(${targetX * scale}px, ${targetY * scale}px)`,
      transformOrigin: "left top",
    };
  }
  render() {
    const charDirection = this.props.store.characterFacing

    return (
      <div className="pet" style={this.getWrapperStyles()}>
        <div
          style={{
            height: "64px",
            width: "64px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            style={{
              position: "absolute",
              // transform: charDirection === "right" ? "" : "scaleX(-1)"
            }}
            src={this.props.store.gameProfile.companion_src}
            alt="companion"
          />
        </div>

      </div>
    );
  }
}

export default Pet;
