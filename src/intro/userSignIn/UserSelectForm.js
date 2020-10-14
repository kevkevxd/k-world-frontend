import React from "react";
import PropTypes from 'prop-types';

class UserSelectForm extends React.Component {

  propTypes = {
    // users: PropTypes.array.isRequired,
  };

  state = {
    renderRightSide: "",
  }

  onSelectChange = (e) => {
    e.preventDefault() 
    const newArray = []
    const tempUserMap = this.props.users.map( user => newArray.push(user) )
    const currentUserObj = newArray.find((currentObj) => currentObj.id === Number(e.target.value))
    this.props.userSelector(currentUserObj);
  }
  render() {
    const userSelectMap = this.props.users.map( user => <option value={user.id}>{user.username}</option>)
    return (  
      <select onChange={this.onSelectChange} className="character-select">
        {userSelectMap}
      </select>
    );
  }
}

export default UserSelectForm;
