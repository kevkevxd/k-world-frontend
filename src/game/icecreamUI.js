import React from "react";
import PropTypes from "prop-types";
import IcecreamIcon from "../assets/SVG/icecreamIcon";
class IcecreamUI extends React.Component {
  static propTypes = {
    keys: PropTypes.object,
    store: PropTypes.object,
  };

  static contextTypes = {
    engine: PropTypes.object,
    scale: PropTypes.number,
  };

  getIcecreamProps = () => {
    // switch statement here. icecream index = what goes inside of post
    const user = this.props.store.gameProfile;
    const icecreamColors = [
      { primarycolor: "#e7886e", shadingcolor: "#dc6646", isTransparent: !user.has_red_icecream },
      { primarycolor: "#e8f70f", shadingcolor: "#d8e60e", isTransparent: !user.has_yellow_icecream },
      { primarycolor: "#0ee6be", shadingcolor: "#08967c", isTransparent: !user.has_blue_icecream },
      { primarycolor: "#65e08e", shadingcolor: "#42995f", isTransparent: !user.has_green_icecream },
      { primarycolor: "#3e4541", shadingcolor: "#2e3330", isTransparent: !user.has_black_icecream },
    ];

    return icecreamColors
    // code block
  }

  render() {

    // const primary = icecreamColors[this.props.currentIndex].primary;
    // const shading = icecreamColors[this.props.currentIndex].shading;
    const uiMap = this.getIcecreamProps().map((props) => <IcecreamIcon {...props} style={{ height: "100px", width: "100px" }
    } />)
    return (
      (
        <div className="icecreamUI" style={{ position: "fixed", bottom: "0px", left: "30px" }}>
          {uiMap}
        </div>
      )
    );
  }
}

export default IcecreamUI;
