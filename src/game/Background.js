import React from "react";
import * as PIXI from 'pixi.js';
import { RGBSplitFilter, TwistFilter } from "pixi-filters";

const bgwidth = 7650;

const min = {
  red: {
    x: -30,
    y: -15,
  },
  green: {
    x: -15,
    y: -10,
  },
  blue: {
    x: -5,
    y: -10,
  },
};

const max = {
  red: {
    x: 8,
    y: 10,
  },
  green: {
    x: 4,
    y: 10,
  },
  blue: {
    x: 20,
    y: 30,
  }
};

const increment = {
  red: {
    x: true,
    y: true,
  },
  green: {
    x: true,
    y: true,
  },
  blue: {
    x: true,
    y: true,
  },
};

const list = [
  'red',
  'green',
  'blue',
]

class Background extends React.Component {
  currentListIndex = 0;

  // Map the filter names to the function you pass into ticker
  get filterAnimationMap() {
    return ({
      rgb: this.animateRGB,
      twisty: this.animateTwisty,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.image === undefined && this.props.image) {
      console.log('image ready');
      this.initPixi();
    }

    if (!prevProps.shouldRGB && this.props.shouldRGB) {
      this.addImageEffect('rgb');
    }

    if (prevProps.shouldRGB && !this.props.shouldRGB) {
      this.removeImageEffect('rgb');
    }


    if (!prevProps.shouldTwisty && this.props.shouldTwisty) {
      this.addImageEffect('twisty');
    }
    if (prevProps.shouldTwisty && !this.props.shouldTwisty) {
      this.removeImageEffect('twisty');
    }

    if (
      prevProps.image !== this.props.image
    ) {
      // Destroy the current pixi and create a new one with the new image
      if (this.pixiNode.contains(this.pixiapp.view)) {
        this.pixiNode.removeChild(this.pixiapp.view);
      }
      this.pixiapp.destroy();
      this.initPixi();
      if (this.props.shouldAnimateBackground) {
        this.addImageEffect();
      }
    }
  }

  initPixi = () => {
    // console.log(`${this.props.image}?q=80&fm=jpg&w=${bgwidth}&h=${window.innerHeight}&fit=crop&crop=edges`);

    if (!this.props.image) {
      return;
    }

    this.pixiapp = new PIXI.Application({
      width: bgwidth,
      height: window.innerHeight,
    });

    // Add the image to pixi
    this.pixiapp.loader.add('image', `${this.props.image}?q=80&fm=jpg&w=${bgwidth}&h=${window.innerHeight}&fit=crop&crop=edges`).load((loader, resources) => {
      this.image = PIXI.Sprite.from(resources.image.url);
      this.image.width = bgwidth;

      // filters
      const rgb = new RGBSplitFilter(
        new PIXI.Point(0, 0),
        new PIXI.Point(0, 0),
        new PIXI.Point(0, 0),
      );

      const twisty = new TwistFilter(0, 0);
      twisty.offset = new PIXI.Point(bgwidth / 2, window.innerHeight / 2);

      this.image.filters = [rgb, twisty];

      // Add the image to the scene we are building
      this.pixiapp.stage.addChild(this.image);
    });

    // Attach the pixi app to pixiNode
    if (this.pixiNode && this.pixiNode.children.length <= 0) {
      this.pixiNode.appendChild(
        this.pixiapp.view
      );
    }
  }

  addImageEffect = (type) => {
    const animation = this.filterAnimationMap[type];
    // console.log('animation', animation);

    if (animation) {
      this.pixiapp.ticker.add(animation);
    }
  }

  removeImageEffect = (type) => {
    const animation = this.filterAnimationMap[type];

    if (animation) {
      this.pixiapp.ticker.remove(animation);
    }
  }

  animateRGB = () => {
    const updateCoordinates = (color, axis) => {
      let currentAxis = this.image.filters[0][color][axis];

      if (increment[color][axis]) {
        currentAxis++;
        if (currentAxis === max[color][axis]) {
          increment[color][axis] = false;
          currentAxis--;
        }
      } else {
        currentAxis--;
        if (currentAxis === min[color][axis]) {
          increment[color][axis] = true;
          currentAxis++;
        }
      }

      return currentAxis;
    }

    const currentShift = list[this.currentListIndex];

    this.image.filters[0][currentShift].set(updateCoordinates(currentShift, 'x'), updateCoordinates(currentShift, 'y'));

    this.currentListIndex++;
    this.currentListIndex = this.currentListIndex % list.length;
  };

  animateTwisty = () => {
    const twistFilter = this.image.filters[1];
    if (twistFilter.angle <= 10) {
      twistFilter.angle++;
    }
    if (twistFilter.radius <= 10000) {
      twistFilter.radius++;
    }
  }

  render() {
    return (
      <div style={{
        width: `${bgwidth}px`,
        height: '100%',
        position: 'absolute',
      }}
        ref={node => { this.pixiNode = node }}></div>
    );
  }

}

export default Background;