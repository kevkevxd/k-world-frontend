import React from "react";
import PropTypes from 'prop-types';

class UserSelectForm extends React.Component {

  propTypes = {
    // users: PropTypes.array.isRequired,
  };
  state = {
    tempState : {}
  } 
  onSelectChange = (e) => {
    e.preventDefault() 
    const newArray = []
    const tempUserMap = this.props.users.map( user => newArray.push(user) )
    const currentUserObj = newArray.find((currentObj) => currentObj.id === Number(e.target.value))
    this.setState({tempState: currentUserObj})
    this.props.moveTempState(currentUserObj)
  }
  login = () => {
    this.props.userSelector(this.state.tempState)
  }
  render() {
    const userSelectMap = this.props.users.map( user => <option value={user.id}>{user.username}</option>)
    return (  
     <div> <select onChange={this.onSelectChange} className="character-select">
        {userSelectMap}
      </select>
      <button onClick={this.login}> Sign in !</button>
      </div>
    );
  }
}

export default UserSelectForm;
