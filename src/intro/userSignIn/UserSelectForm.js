import React from "react";
import PropTypes from 'prop-types';

class UserSelectForm extends React.Component {

  propTypes = {
    // users: PropTypes.array.isRequired,
  };
  state = {
    tempState : null
  } 
  onSelectChange = (newValue) => {
    const currentUserObj = this.props.users.find((currentObj) => currentObj.id === Number(newValue));
    this.setState({tempState: currentUserObj});
    this.props.moveTempState(currentUserObj);
  }
  login = () => {
    this.props.userSelector(this.state.tempState)
  }
  loginWithFirst = () => {
    this.props.userSelector(this.props.users[0])
  }
  delete = () => {
    this.props.deleteUser(this.state.tempState)
  }

  deleteFirst = () => {
    this.props.deleteUser(this.props.users[0])
  }
  
  render() {
    const userSelectMap = this.props.users.map( user => <div className="character-option" onClick={() => this.onSelectChange(user.id)} value={user.id}>{user.username}</div>)
    return (  
     <div>
       <div className="character-select">
        {userSelectMap}
      </div>
  
      
      {this.state.tempState === null && <button onClick={this.state.tempState === null ? this.loginWithFirst : this.login}>Sign in !</button>}
      {this.state.tempState === null && <button onClick={this.state.tempState === null ? this.deleteFirst : this.delete}>Delete User</button>}
      </div>
    );
  }
}

export default UserSelectForm;
