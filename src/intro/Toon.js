import React from "react";

class Toon extends React.Component {
  render() {
    return (
      <div className="sprite">
        {this.props.sprite.name}
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
            src={this.props.sprite.src}
            alt={this.props.sprite.name}
          />
        </div>
      </div>
    );
  }
}

export default Toon;
