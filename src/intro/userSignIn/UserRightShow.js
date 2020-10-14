import React from "react";
import propTypes from 'prop-types';


class UserRightShow extends React.Component {
  // propTypes = {
  //   userSelector: propTypes.func.isRequired,
  // }

  render() {
      //currently don't have access to the SRC of selected game profile. 
    return (
      <div>
         {this.props.gameProfile.username}
        {this.props.gameProfile.character}
        <div data-sprite-name={this.props.gameProfile.character} 
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

    );
  }
}

export default UserRightShow;
