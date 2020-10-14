import React from "react";
import User from "./User"

class SignIn extends React.Component {

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
    const userPool = this.state.allUsers
    const userMap = userPool.map((person) => <User user={person} userSelector={this.props.userSelector}/>)
    return (
    <div><h1>Who are you?</h1> <div>{userMap}</div></div>
    );
  }
}

export default SignIn;
