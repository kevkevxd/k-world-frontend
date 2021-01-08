import React from "react";
import PropTypes from "prop-types";

class Dice extends React.Component {
  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  getWrapperStyles(position) {
    const { stageX } = this.props.store;
    const { scale } = this.context;
    const { x, y } = position;
    const targetX = x + stageX;
    const targetY = y;

    return {
      position: "absolute",
      transform: `translate(${targetX * scale}px, ${targetY * scale}px)`,
      transformOrigin: "left top",
    };
  }
  render() {
    const dice = [
      { dice: this.props.store.isCirclesDiceThere, source: "./assets/dice/circles.png", position: this.props.store.circlesDicePosition },
      { dice: this.props.store.isGrindDiceThere, source: "./assets/dice/grind.png", position: this.props.store.grindDicePosition },
      { dice: this.props.store.isNobloomDiceThere, source: "./assets/dice/nobloom.png", position: this.props.store.nobloomDicePosition },
      { dice: this.props.store.isTempDiceThere, source: "./assets/dice/temp.png", position: this.props.store.tempDicePosition },
    ];

    const diceMap = dice.map(({ dice, source, position }) => dice && (
      <div style={this.getWrapperStyles(position)} >
        <img alt="" src={source} style={{ width: 130 }} />
      </div>
    ));

    return (
      <>
        { diceMap}
      </>
    );
  }
}

export default Dice;
