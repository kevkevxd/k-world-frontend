import React from "react";
import PropTypes from "prop-types";
import { Body, Sprite } from "react-game-kit";
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
    const x = this.props.store.characterPosition.x;
    const icecreamColors = [
      { primary: "#e7886e", shading: "#dc6646" },
      { primary: "#e8f70f", shading: "#d8e60e" },
      { primary: "#0ee6be", shading: "#08967c" },
      { primary: "#65e08e", shading: "#42995f" },
      { primary: "#3e4541", shading: "#2e3330" },
    ];
    const iceMap = icecreamColors.map(({ primary, shading }) => (
      <IcecreamIcon style={{ width: 75 }} primary={primary} shading={shading} />
    ));
    return (
      this.props.store.isIcecreamThere && (
        <div className="icecream" style={this.getWrapperStyles()}>
          {iceMap}
          {/* <Body
            label="icecream"
            args={[x, 384, 120, 120]}
            inertia={Infinity}
            ref={(b) => {
              this.body = b;
            }}
          >
          </Body> */}
        </div>
      )
    );
  }
}

export default Icecream;