import React from "react";
import Toon from "./Toon";
import Friend from "./friend"
class SpriteSelectSlider extends React.Component {

  render() {

    const spriteArray = this.props.sprites;
    const spriteRender = spriteArray.map((sprite, spriteIndex) => (
      <div className={`character-option ${this.props.characterIndex === spriteIndex ? 'selected' : ''}`}>
        <Toon 
          key={sprite} 
          sprite={sprite} 
          characterHandler={this.props.characterHandler}
          spriteIndex={spriteIndex}
          // setCharacterSrc={this.props.setCharacterSrc} 
          // setCharacterSteps={this.props.setCharacterSteps}
        />
      </div>
    ));
    const companionArray = this.props.companionArray
    const companionRender = companionArray.map((companion, companionIndex) => ( 
      <div className={`character-option ${this.props.companionIndex === companionIndex ? 'selected' : ''}`}>
        <Friend key={companion} 
          companion={companion} 
          companionHandler={this.props.companionHandler} 
          companionIndex={companionIndex}
        />
      </div>
    ))
    return (
      <div className="sprite-select">
        
        <div className="character-container">
        <h1>Choose a character</h1>
        <div className="sprite-render character-select">
          {spriteRender}
        </div>
        </div>
        <div className="champion-container">
        <h1>Choose a companion</h1>
          <div className="companion-render character-select">
            {companionRender}
          </div>
          </div>
      </div>
    );
  }
}

export default SpriteSelectSlider;
