import React from "react";
import propTypes from 'prop-types';
import UserSelectForm from "./UserSelectForm";

class SignIn extends React.Component {

  // propTypes = {
  //   userSelector: propTypes.func.isRequired,
  // }
state = {
    allUsers: [],
}
  
componentDidMount() {
    fetch("http://localhost:5003/users")
    .then((res) => res.json())
    .then((data) => 
    this.setState({ allUsers: data }));
}

  render() {
    const userPool = this.state.allUsers;
    return (
    <div><h1>Who are you?</h1> <div><UserSelectForm users={userPool} userSelector={this.props.userSelector}/></div></div>
    );
  }
}

export default SignIn;
