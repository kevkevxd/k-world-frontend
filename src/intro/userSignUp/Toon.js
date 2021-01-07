import React from "react";

class Toon extends React.Component {

  pickCharacter = (e) => {
    e.preventDefault();
    this.props.characterHandler(Number(e.currentTarget.getAttribute('data-index')));

  }

  render() {
    return (
      <div
        className="sprite"
        onClick={this.pickCharacter}
        data-index={this.props.spriteIndex}
      >
        {this.props.sprite.character}
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
