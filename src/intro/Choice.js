import React from "react";

class Choice extends React.Component {

signinListener = (event) => {
    this.props.choiceSelect(event.target.textContent)
}
  render() {
    return (
      <div className="intro">
        <button onClick={this.signinListener}>Sign In</button>  <button onClick={this.signinListener}>Sign Up</button>
      </div>

      
    );
  }
}

export default Choice;
