import React from "react";
import ScrollButton from "../../utils/button";
import Toon from "./Toon";
class SpriteSelectSlider extends React.Component {
  // state = {
  //   displayIndex: 0,
  // };
  // next = (event) => {
  //   this.setState({
  //     displayIndex: this.state.displayIndex + 3,
  //   });
  // };
  // prev = (event) => {
  //   this.setState({
  //     displayIndex: this.state.displayIndex - 3,
  //   });
  // };

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
    return <div>{spriteRender}</div>;
    // const spriteArray = this.props.sprites;
    // return (
    //   <div className="sprite-select">
    //     <div className="shelf-button">
    //       {this.state.displayIndex !== 0 && (
    //         <ScrollButton moreItems={this.prev}>
    //           <svg
    //             width="1em"
    //             height="1em"
    //             viewBox="0 0 16 16"
    //             class="bi bi-arrow-left-circle-fill"
    //             fill="currentColor"
    //             xmlns="http://www.w3.org/2000/svg"
    //           >
    //             <path
    //               fill-rule="evenodd"
    //               d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5.5a.5.5 0 0 0 0-1H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5z"
    //             />
    //           </svg>
    //         </ScrollButton>
    //       )}
    //     </div>
    //     {spriteArray.slice(
    //       this.state.displayIndex,
    //       this.state.displayIndex + 3
    //     )}
    //     <div className="fridge-shelf-button">
    //       {spriteArray.length > this.state.displayIndex + 4 && (
    //         <ScrollButton moreItems={this.next}>
    //           <svg
    //             width="1em"
    //             height="1em"
    //             viewBox="0 0 16 16"
    //             class="bi bi-arrow-right-circle-fill"
    //             fill="currentColor"
    //             xmlns="http://www.w3.org/2000/svg"
    //           >
    //             <path
    //               fill-rule="evenodd"
    //               d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-11.5.5a.5.5 0 0 1 0-1h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5z"
    //             />
    //           </svg>
    //         </ScrollButton>
    //       )}
    //     </div>
    //   </div>
    // );
  }
}

export default SpriteSelectSlider;
