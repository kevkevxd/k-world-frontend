import React from "react";
import Game from "./game";
import Intro from "./intro";
import LoginForm from "./intro/LoginForm";

class App extends React.Component {
  state = {
    currentScreenIndex: 0,
    characterArray: [
      {
        name: "Kevin",
        src: "assets/leattyspritesheet.png",
      },
    ],
    companionArray: [],
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

  onFormComplete = (characterFormObj) => {
    console.log(characterFormObj);
    // send post request to /users

    // load the game w/ sprite and companion selections.

    // Start the game
    //possibily add a fade component here or a delay timer
    this.setState({ currentScreenIndex: 2 });
  };

  render() {
    const showScreen = () => {
      if (this.state.currentScreenIndex === 0) {
        return <Intro />;
      } else if (this.state.currentScreenIndex === 1) {
        return (
          <LoginForm
            onFormComplete={this.onFormComplete}
            characterArray={this.state.characterArray}
            companionArray={this.state.companionArray}
          />
        );
      }
      return <Game />;
    };
    return <div className="App">{showScreen()}</div>;
  }
}
export default App;
