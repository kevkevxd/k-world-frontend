import React from "react";
import PropTypes from 'prop-types';

class UserSelectForm extends React.Component {

  propTypes = {
    users: PropTypes.array.isRequired,
  };

  onSelectChange = (e) => {
      e.preventDefault();

      console.log(e.target.value);
      // this.props.userSelector(e.target.value);
  }
  render() {
    const userSelectMap = this.props.users.map( user => <option value={this.props.users}>{this.props.users.username}</option>)
    return (
       
    <select
      onChange={this.onSelectChange}
    //   value={this.state.size}
        className="form-control"
      >
        {userSelectMap}
        {/* <option value="Medium">Medium</option>
        <option value="Large">Large</option> */}
    </select>
   
    );
  }
}

export default UserSelectForm;
