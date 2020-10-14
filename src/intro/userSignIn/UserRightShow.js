import React from "react";
import propTypes from 'prop-types';


class UserRightShow extends React.Component {
  // propTypes = {
  //   userSelector: propTypes.func.isRequired,
  // }
state = {
    allUsers: [],
}
  
  render() {

    return (
      <div>
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

export default UserRightShow;
