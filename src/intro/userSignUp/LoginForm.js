import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import SpriteSelect from "./SpriteSelect";

// todo: change name to SignupForm when creating new user

class LoginForm extends React.Component {
  state = {
    username: "",
    character: "",
    // companion: "",
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
  //make submit button only available if they've made a selection in each of the three
  render() {
    // have to pass in rendered jsx components to SpriteSelect
    // const companionMapper = this.props.companionArray.map((companion) => (
    //   <SpriteSelect sprites={companion} />
    // ));
    return (
      <div>
        <SpriteSelect sprites={this.props.characterArray} characterHandler={this.pickCharacter} />
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
          {/* <Form.Control
            type="hidden"
            name="companion"
            value={this.state.companion} //change this to whatever the user clicks/maybe get rid of this
            onChange={this.formHandler}
            className="form-input"
          /> */}
          <Button type="submit" name="submit" className="form-button"></Button>
        </Form>
      </div>
    );
  }
}

export default LoginForm;
