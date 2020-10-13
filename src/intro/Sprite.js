import React from "react";

class Sprite extends React.Component {
  render() {
    return (
      <div className="sprite">
        Name: {this.props.sprite.name}
        <img src={this.props.sprite.src} alt={this.props.sprite.name} />
      </div>
    );
  }
}

export default Sprite;
