import React from "react";

class User extends React.Component {

selectedUser = (e) => {
    e.preventDefault()
    this.props.userSelector(e.currentTarget.getAttribute('data-user'))
    console.log("click:", e.currentTarget.getAttribute('data-user'))
    console.log("props???", this.props)
    //currenttarget is giving object object. 
}
  render() {

    return (
       
        <div>
        <select
        //   onChange={this.sizeClicker}
        //   value={this.state.size}
          className="form-control"
        >
          <option value="">{this.props.username}</option>
          {/* <option value="Medium">Medium</option>
          <option value="Large">Large</option> */}
        </select>
      </div>
   
    );
  }
}

export default User;
