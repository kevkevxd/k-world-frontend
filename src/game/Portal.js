import React from "react";
import PropTypes from "prop-types";

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

  render() {
    return (
      this.props.store.isPortalOpen && (
        <div className="portal" style={this.getWrapperStyles()}>
          <img
            src="assets/portal.png"
            alt=""
            style={{
              width: "auto", height: 220
            }}
          />
        </div>
      )
    );
  }
}

export default Portal;
