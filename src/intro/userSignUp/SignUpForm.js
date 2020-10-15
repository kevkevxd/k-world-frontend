import React from "react";
import Form from "react-bootstrap/Form";
import SpriteSelect from "./SpriteSelectSlider";

// todo: change name to SignupForm when creating new user

class SignUpForm extends React.Component {
  state = {
    username: "",
    character: "Poof",
    character_src: "assets/leattyspritesheet.png",
    
    // companion: "",
    // companionSrc: "",
  };

  characterSubmitHandler = (e) => {
    e.preventDefault();
    this.props.onFormComplete(this.state);
    console.log("formpage:", this.state)
  };

  formHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  pickCharacter = (char) => {
    this.setState({character: char})
  }
  setCharacterSrc = (src) => {
    this.setState({character_src: src})
  }
  //make submit button only available if they've made a selection in each of the three
  render() {
    // have to pass in rendered jsx components to SpriteSelect
    // const companionMapper = this.props.companionArray.map((companion) => (
    //   <SpriteSelect sprites={companion} />
    // ));
    return (
      <div>
        <h1> Create your character</h1>
        <SpriteSelect sprites={this.props.characterArray} characterHandler={this.pickCharacter} setCharacterSrc={this.setCharacterSrc} />
        <Form onSubmit={this.characterSubmitHandler}>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter Username"
            name="username"
            value={this.state.username}
            onChange={this.formHandler}
            className="form-input"
          />
          <Form.Control
            type="hidden"
            name="character"
            value={this.state.character} //change this to whatever the user clicks/maybe get rid of this
            className="form-input"
          />
            <Form.Control
            type="hidden"
            name="character_src"
            value={this.state.character_src} //change this to whatever the user clicks/maybe get rid of this
            className="form-input"
          />
          {/* <Form.Control
            type="hidden"
            name="companion"
            value={this.state.companion} //change this to whatever the user clicks/maybe get rid of this
            onChange={this.formHandler}
            className="form-input"
          /> */}
          <button type="submit" name="submit" className="form-button"></button>
        </Form>
      </div>
    );
  }
}

export default SignUpForm;
