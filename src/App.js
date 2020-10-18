import React, { Component } from "react";
import Game from "./game";
import Intro from "./intro";
import LoginForm from "./intro/userSignUp/SignUpForm";
import SignIn from "./intro/userSignIn"
import Choice from "./intro/Choice"
// import hash from "./hash";
import "./App.css";
import * as $ from "jquery";
import Player from "./music/player";
export const authEndpoint = 'https://accounts.spotify.com/authorize';
// Replace with your app's client ID, redirect URI and desired scopes
const clientId = "74b733b7e89f4c7bb98b3986710f9ad7";
const redirectUri = "http://localhost:6969/redirect";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];
// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentScreenIndex: 0,
      characterArray: [
        {
          name: "Poof",
          src: "assets/leattyspritesheet.png",
        },
      ],
      companionArray: [],
      gameProfile: {},
      token: null,
    item: {
      album: {
        images: [{ url: "" }]
      },
      name: "",
      artists: [{ name: "" }],
      duration_ms:0,
    },
    is_playing: "Paused",
    progress_ms: 0
  };
  this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }
  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      }
    });
  }
  // state = {
  // };

  //add a section on screenindex 2 for showing already created
  //users and then add a button to redirect to "create a new user"

  componentDidMount() {
    // Listens for keyboard events
    document.addEventListener("keydown", this.onEnterIntroScreen);
        // Set token
      let _token = hash.access_token;
      if (_token) {
          // Set token
       this.setState({
           token: _token
       });
    }
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
    console.log("currentgameprofile", this.state.gameProfile)
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
  //   return <div className="App">{showScreen()}</div>;
  // }
// }
return (
  <div className="App">
    <header className="App-header">
 
    {!this.state.token && (
      <a
        className="btn btn--loginApp-link"
        href={`${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
      >
        Login to Spotify
      </a>
    )}
    {this.state.token && (
    <Player
    item={this.state.item}
    is_playing={this.state.is_playing}
    progress_ms={this.progress_ms}
  />
)}
    </header>
  </div>
);
}
}
export default App;
