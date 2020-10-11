import React from "react";
import PropTypes from "prop-types";
import { Body, Sprite } from "react-game-kit";

class Portal extends React.Component {
  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  getWrapperStyles() {
    const { portalPosition, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = portalPosition;
    const targetX = x + stageX;
    const targetY = y;

    return {
      position: "absolute",
      // Translate is a CSS property that will move the container
      transform: `translate(${targetX * scale}px, ${targetY * scale}px)`,
      transformOrigin: "left top",
    };
  }
  // randomMethod() {
  //   this.body
  // }
  render() {
    const x = this.props.store.characterPosition.x;
    return (
      this.props.store.isPortalOpen && (
        <div className="portal" style={this.getWrapperStyles()}>
          <Body
            label="portal"
            args={[x, 384, 120, 120]}
            inertia={Infinity}
            ref={(b) => {
              this.body = b;
            }}
          >
            <img
              src="assets/portal.png"
              style={{ width: "auto", height: 150 }}
            />
          </Body>
        </div>
      )
    );
  }
}

export default Portal;
