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
  console.log(obj);
  this.setState({rightDisplay: obj })
}

deleteUser = (user) => {
  fetch(`http://localhost:5003/users/${user.id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      accepts: "application/json",
    },
    body: JSON.stringify(user),
  })
  .then((res) => res.json())
  .then((currentObj) => {
    const updatedArray = this.state.allUsers.filter(
       currentObj => user.id !== currentObj.id
    );
    
    this.setState({
        allUsers: updatedArray,
    });
  });
}
  render() {
    return (
    <div className="user-sign-in-container">
        <div className="user-select-form">
          <UserSelectForm users={this.state.allUsers} userSelector={this.props.userSelector} moveTempState={this.moveTempState} deleteUser={this.deleteUser}/>
        </div>
        <div className="user-right-show">
          <UserRightShow gameProfile={this.state.rightDisplay}/>
        </div>
    </div>
    );
  }
}

export default SignIn;
