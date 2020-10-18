import React from "react";
import Game from "./game";
import Intro from "./intro";
import LoginForm from "./intro/userSignUp/SignUpForm";
import SignIn from "./intro/userSignIn"
import Choice from "./intro/Choice"
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./music/config";
import hash from "./music/hash";
import Player from "./music/player";
import "./App.css";
class App extends React.Component {
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
        duration_ms: 0
      },
      is_playing: "Paused",
      progress_ms: 0,
      no_data: false,
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.tick = this.tick.bind(this);
  }
  // state = {
  //   currentScreenIndex: 0,
  //   characterArray: [
  //     {
  //       name: "Poof",
  //       src: "assets/leattyspritesheet.png",
  //     },
  //   ],
  //   companionArray: [],
  //   gameProfile: {},
  // };

  //add a section on screenindex 2 for showing already created
  //users and then add a button to redirect to "create a new user"

  componentDidMount() {
      // Set token
    let _token = hash.access_token;

    if (_token) {
        // Set token
      this.setState({
          token: _token
    });
      this.getCurrentlyPlaying(_token);
    }
  
      // set interval for polling every 5 seconds
     this.interval = setInterval(() => this.tick(), 5000);
    // Listens for keyboard events
     document.addEventListener("keydown", this.onEnterIntroScreen);
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
    }
  }

  
  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }

        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  playNext = async  () => {
    console.log('play next');
    fetch('https://api.spotify.com/v1/me/player/next', {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
        "Authorization": "Bearer " + this.state.token,
        'access-control-allow-credentials': true,
        'access-control-allow-headers': 'Accept, App-Platform, Authorization, Content-Type, Origin, Retry-After, Spotify-App-Version, X-Cloud-Trace-Context, client-token',
        'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE, PATCH',
        'access-control-allow-origin': '*',
        'access-control-max-age': 604800,
      },
    })
    .then((res) => { console.log(res); return res.json() })
    .then(data => {
      console.log(data);
      // data.playNext(token);
    })
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
    console.log("formobj:", characterFormObj)
    fetch("http://localhost:5003/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
      },
      body: JSON.stringify(characterFormObj),
    })
      .then((res) => res.json())
      .then((newObj) => {
        console.log("newobj:", newObj)
        this.setState({ gameProfile: [newObj] })
      })

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
    return <div className="App">
      {showScreen()}


      <div className="spotify-app">
        {!this.state.token && (
          <a
            className="btn btn--loginApp-link"
            href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login to Spotify
          </a>
        )}
        {this.state.token && !this.state.no_data && (
          <Player
            item={this.state.item}
            is_playing={this.state.is_playing}
            progress_ms={this.state.progress_ms}
            playNext={this.playNext}
          />
          
        )}
        {this.state.no_data && (
          <p>
            You need to be playing a song on Spotify, for something to appear here.
          </p>
        )}
      </div>
    </div>;
  }
}
export default App;
