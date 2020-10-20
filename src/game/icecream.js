import React from "react";
import PropTypes from "prop-types";
import IcecreamIcon from "../assets/SVG/icecreamIcon";
class Icecream extends React.Component {
  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  getWrapperStyles() {
    const { icecreamPosition, stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = icecreamPosition;
    const targetX = x + stageX;
    const targetY = y;

    return {
      position: "absolute",
      transform: `translate(${targetX * scale}px, ${targetY * scale}px)`,
      transformOrigin: "left top",
    };
  }
  render() {
    const icecreamColors = [
      { primary: "#e7886e", shading: "#dc6646" },
      { primary: "#e8f70f", shading: "#d8e60e" },
      { primary: "#0ee6be", shading: "#08967c" },
      { primary: "#65e08e", shading: "#42995f" },
      { primary: "#3e4541", shading: "#2e3330" },
    ];

    const primary = this.props.currentIndex < 5 && icecreamColors[this.props.currentIndex].primary
    const shading = this.props.currentIndex < 5 && icecreamColors[this.props.currentIndex].shading

    return (
      this.props.store.isIcecreamThere && this.props.currentIndex < 5 && (
        <div className="icecream" style={this.getWrapperStyles()}>
          <IcecreamIcon
            style={{ width: 85 }}
            primarycolor={primary}
            shadingcolor={shading}
          />
        </div>
      )
    );
  }
}

export default Icecream;
