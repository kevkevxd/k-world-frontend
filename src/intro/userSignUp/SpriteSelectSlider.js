import React from "react";
import Toon from "./Toon";
import Friend from "./friend"
class SpriteSelectSlider extends React.Component {

  render() {
    const spriteArray = this.props.sprites;
    const spriteRender = spriteArray.map((sprite, spriteIndex) => (
      <Toon 
        key={sprite} 
        sprite={sprite} 
        characterHandler={this.props.characterHandler}
        spriteIndex={spriteIndex}
        // setCharacterSrc={this.props.setCharacterSrc} 
        // setCharacterSteps={this.props.setCharacterSteps}
      />
    ));
    const companionArray = this.props.companionArray
    const companionRender = companionArray.map((companion, companionIndex) => (
      <Friend key={companion} 
        companion={companion} 
        characterHandler={this.props.companionHandler} 
        companionIndex={companionIndex}
      />
    ))
    return <div>
             <h1>Choose your character</h1>
                <div className="sprite-render">
                  {spriteRender}
                </div>
              <h1>Choose your companion</h1>
                <div className="companion-render">
                  {companionRender}
                </div>
           </div>


  }
}

export default SpriteSelectSlider;
