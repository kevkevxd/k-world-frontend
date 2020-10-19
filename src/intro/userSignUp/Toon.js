import React from "react";

class Toon extends React.Component {

  pickCharacter = (e) => {
    e.preventDefault()
    this.props.characterHandler(Number(e.currentTarget.getAttribute('data-index')))
    // this.props.setCharacterSrc(e.currentTarget.getAttribute('data-sprite-src'))
    // this.props.setCharacterSteps(e.currentTarget.getAttribute('data-sprite-steps'))
    // console.log(e.currentTarget.getAttribute('data-sprite-steps'))
    // console.log("clicked")
  }

  render() {
    return (
      <div className="sprite">
        {this.props.sprite.character}
        <div
          data-index={this.props.spriteIndex}
          // data-sprite-src={this.props.sprite.character_src}
          // data-sprite-steps={this.props.sprite.character_steps}
          onClick={this.pickCharacter}
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
            }}
            src={this.props.sprite.character_src}
            alt={this.props.sprite.character}
          />
        </div>
      </div>
    );
  }
}

export default Toon;
