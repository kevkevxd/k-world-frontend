import React from "react";
import PropTypes from 'prop-types';

class UserSelectForm extends React.Component {

  propTypes = {
    users: PropTypes.array.isRequired,
  };

  onSelectChange = (e) => {
      e.preventDefault()
      this.props.userSelector(e.target.value);
  }
  render() {
    const userSelectMap = this.props.users.map( user => <option value={user}>{user.username}</option>)
    return (  
      <select onChange={this.onSelectChange} className="character-select">
        {userSelectMap}
      </select>
    );
  }
}

export default UserSelectForm;
