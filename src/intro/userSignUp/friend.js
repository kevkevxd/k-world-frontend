import React from "react";

class Friend extends React.Component {

  pickCompanion = (e) => {
    e.preventDefault()
    this.props.companionHandler(Number(e.currentTarget.getAttribute('data-index')))
  }

  render() {
    return (
      <div 
        className="sprite"
        onClick={this.pickCompanion}
        data-index={this.props.companionIndex}
      >
        
        {this.props.companion.companion}
        <div
          data-index={this.props.companionIndex}
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
