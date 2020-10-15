import React from "react";
import propTypes from 'prop-types';
import UserSelectForm from "./UserSelectForm";
import UserRightShow from "./UserRightShow"

class SignIn extends React.Component {

  // propTypes = {
  //   userSelector: propTypes.func.isRequired,
  // }
state = {
    allUsers: [],
    rightDisplay: {},
}
  
componentDidMount() {
    fetch("http://localhost:5003/users")
    .then((res) => res.json())
    .then((data) => 
    this.setState({ allUsers: data }));
}

moveTempState = (obj) => {
  this.setState({rightDisplay: obj })
}
  render() {
    return (
    <div>
      <h1>Who are you?</h1> 
        <div className="user-select-form">
          <UserSelectForm users={this.state.allUsers} userSelector={this.props.userSelector} moveTempState={this.moveTempState}/>
        </div>
        <div className="user-right-show">
          <UserRightShow gameProfile={this.state.rightDisplay}/>
        </div>
    </div>
    );
  }
}

export default SignIn;
