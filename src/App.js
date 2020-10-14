import React from "react";
import Game from "./game";
import Intro from "./intro";
import LoginForm from "./intro/LoginForm";

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
    gameProfile: [],
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
    fetch("http://localhost:5003/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
      },
      body: JSON.stringify(characterFormObj),
    })
      .then((res) => res.json())
      .then((newObj) => console.log("post form:", newObj))
      //   this.setState({ gameProfile: [newObj, ...this.state.gameProfile] })
      // );

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
            // companionArray={this.state.companionArray}
          />
        );
      }
      return <Game />;
    };
    return <div className="App">{showScreen()}</div>;
  }
}
export default App;
