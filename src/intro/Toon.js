import React from "react";

class Toon extends React.Component {

  pickCharacter = (e) => {
    e.preventDefault()
    this.props.characterHandler(e.currentTarget.getAttribute('data-sprite-name'))
  }

  render() {
    return (
      <div className="sprite">
        {this.props.sprite.name}
        <div data-sprite-name={this.props.sprite.name} onClick={this.pickCharacter}
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
            src={this.props.sprite.src}
            alt={this.props.sprite.name}
          />
        </div>
      </div>
    );
  }
}

export default Toon;
