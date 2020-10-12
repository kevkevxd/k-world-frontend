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
    return (
      this.props.store.isIcecreamThere && (
        <div className="icecream" style={this.getWrapperStyles()}>
          <IcecreamIcon style={{ width: 75 }} />
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
