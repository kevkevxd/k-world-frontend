import React from "react";

class Friend extends React.Component {

  pickCharacter = (e) => {
    e.preventDefault()
    this.props.characterHandler(Number(e.currentTarget.getAttribute('data-index')))
  }

  render() {
    return (
      <div className="companion">
        {this.props.companion.companion}
        <div
          data-index={this.props.companionIndex}
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
            src={this.props.companion.companion_src}
            alt={this.props.companion.companion}
          />
        </div>
      </div>
    );
  }
}

export default Friend;
