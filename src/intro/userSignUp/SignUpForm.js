import React from "react";
import SpriteSelect from "./SpriteSelectSlider";

// todo: change name to SignupForm when creating new user

class SignUpForm extends React.Component {
  state = {
    username: "",
    characterIndex: 0,
    companionIndex: 0,
  };

  characterSubmitHandler = (e) => {
    e.preventDefault();
    this.props.onFormComplete({
      ...this.props.characterArray[this.state.characterIndex],
      ...this.props.companionArray[this.state.companionIndex],
      username: this.state.username
    });
  };

  usernameHandler = (e) => {
    this.setState({ username: e.target.value });
  };


  pickCharacter = (characterIndex) => {
    console.log(characterIndex);
    // this.setState({character: char})
    this.setState({ characterIndex });
  };
  
  pickCompanion = (companionIndex) => {
    // this.setState({character: char})
    this.setState({ companionIndex });
  };


  render() {

    return (
      <div className="sign-up">
        <SpriteSelect 
          sprites={this.props.characterArray} 
          characterHandler={this.pickCharacter}
          companionHandler={this.pickCompanion}
          companionArray={this.props.companionArray}
          characterIndex={this.state.characterIndex}
          companionIndex={this.state.companionIndex}
        />
        <form onSubmit={this.characterSubmitHandler}>
          <div className="row">
            <input
              size="lg"
              type="text"
              placeholder="Enter Username"
              name="username"
              value={this.state.username}
              onChange={this.usernameHandler}
              className="input-username"
              autocomplete="off"
            />
        
            <button type="submit" name="submit" className="button-submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUpForm;
