import React from "react";
import Game from "./game";
import Intro from "./intro";
import LoginForm from "./intro/userSignUp/SignUpForm";
import SignIn from "./intro/userSignIn"
import Choice from "./intro/Choice"

class App extends React.Component {
  state = {
    currentScreenIndex: 0,
    characterArray: [
      {
        name: "Poof",
        src: "assets/leattyspritesheet.png",
      },
    ],
    companionArray: [],
    gameProfile: {},
  };

  //add a section on screenindex 2 for showing already created
  //users and then add a button to redirect to "create a new user"

  componentDidMount() {
    // Listens for keyboard events
    document.addEventListener("keydown", this.onEnterIntroScreen);
  }

  onEnterIntroScreen = (event) => {
    if (event.key === "Enter" && this.state.currentScreenIndex === 0) {
      this.setState({ currentScreenIndex: 1 });
    }
  };
  
  choiceSelect = (choice) => {
    if (choice === "Sign In") {
      this.setState({ currentScreenIndex: 2})
    } else if ( choice === "Sign Up") {
      this.setState({ currentScreenIndex: 3})
    }
  }

  onFormComplete = (characterFormObj) => {
    fetch("http://localhost:5003/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
      },
      body: JSON.stringify(characterFormObj),
    })
      .then((res) => res.json())
      .then((newObj) => 
        this.setState({ gameProfile: [newObj] })
      );

    this.setState({ currentScreenIndex: 4 });
  };

  userSelector = (user) => {
    this.setState({gameProfile: user})
        // make user actually represent gameprofile selection (sprites/icecreams)
    this.setState({ currentScreenIndex: 4 });
  }

  render() {

    const showScreen = () => {
      if (this.state.currentScreenIndex === 0) {
          return <Intro />;
      } else if (this.state.currentScreenIndex === 1) {
          return <Choice choiceSelect={this.choiceSelect}/> 
      } else if (this.state.currentScreenIndex === 2) {
          return <SignIn userSelector={this.userSelector} gameProfile={this.state.gameProfile}/>
      } else if (this.state.currentScreenIndex === 3) {
          return (
            <LoginForm
              onFormComplete={this.onFormComplete}
              characterArray={this.state.characterArray}
              // companionArray={this.state.companionArray}
            />
          );
      }
      //loginform
      //check if game profile is empty or not
      return <Game gameProfile={this.state.gameProfile} />;
    };
    return <div className="App">{showScreen()}</div>;
  }
}
export default App;
