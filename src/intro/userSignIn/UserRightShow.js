import React from "react";

class UserRightShow extends React.Component {

  render() {
    return (
      <div className="character-select-right">

        <div className="character-select-username">
          <h1>{this.props.gameProfile.username}</h1>
        </div>

        <div className="character-select-character">
          <h2>{this.props.gameProfile.character}</h2>
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
              src={this.props.gameProfile.character_src}
              alt={this.props.gameProfile.username}
            />
          </div>
        </div>

        <div className="character-select-companion">
          <h2>{this.props.gameProfile.companion}</h2>
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
              src={this.props.gameProfile.companion_src}
              alt={this.props.gameProfile.companion}
            />
          </div>
        </div>
      </div>

    );
  }
}

export default UserRightShow;
