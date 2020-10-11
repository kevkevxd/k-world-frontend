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
    const { characterPosition, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = characterPosition;
    const targetX = x + stageX - 100;
    const targetY = y - 40;

    return {
      position: "absolute",
      // Translate is a CSS property that will move the container
      transform: `translate(${targetX * scale}px, ${targetY * scale}px)`,
      transformOrigin: "left top",
    };
  }
  render() {
    return (
      <div className="portal" style={this.getWrapperStyles()}>
        <Body
          args={[300, 384, 64, 64]}
          inertia={Infinity}
          ref={(b) => {
            this.body = b;
          }}
        >
          <img src="assets/portal.png" style={{ width: "auto", height: 150 }} />
        </Body>
      </div>
    );
  }
}

export default Pet;
