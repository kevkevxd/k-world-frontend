import React from "react";
import PropTypes from 'prop-types';

class UserSelectForm extends React.Component {

  propTypes = {
    users: PropTypes.array.isRequired,
  };

  onSelectChange = (e) => {
      e.preventDefault();
      // this.props.userSelector(e.currentTarget.getAttribute('data-user'))
      // console.log("click:", e.currentTarget.getAttribute('data-user'))
      // console.log("props???", this.props)
      //currenttarget is giving object object. 
      console.log(e.target.value);
      // this.props.userSelector(e.target.value);
  }
  render() {

    return (
       
    <select
      onChange={this.onSelectChange}
    //   value={this.state.size}
        className="form-control"
      >
        {users.map(
          user =>
            <option value={user.username}>{user.username}</option>
        )}
        {/* <option value="Medium">Medium</option>
        <option value="Large">Large</option> */}
    </select>
   
    );
  }
}

export default UserSelectForm;
