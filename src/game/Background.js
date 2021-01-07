import React from "react";
import * as PIXI from 'pixi.js';
import { RadialBlurFilter, ReflectionFilter, RGBSplitFilter, TwistFilter } from "pixi-filters";

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

  state = {
    currentImage: ""
  }

  currentListIndex = 0;

  // Map the filter names to the function you pass into ticker
  get filterAnimationMap() {
    return ({
      rgb: this.animateRGB,
      twisty: this.animateTwisty,
      reflection: this.animateReflection,
      radial: this.animateRadial,
      reset: this.reset
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.store.image === undefined && this.props.store.image) {
      console.log('image ready');
      this.initPixi();
    }

    if (!prevProps.store.shouldRGB && this.props.store.shouldRGB) {
      this.addImageEffect('rgb');
    }

    if (prevProps.store.shouldRGB && !this.props.store.shouldRGB) {
      this.removeImageEffect('rgb');
    }

    if (!prevProps.store.shouldTwisty && this.props.store.shouldTwisty) {
      this.addImageEffect('twisty');
    }
    if (prevProps.store.shouldTwisty && !this.props.store.shouldTwisty) {
      this.removeImageEffect('twisty');
    }

    if (!prevProps.store.shouldReflect && this.props.store.shouldReflect) {
      this.addImageEffect('reflection');
      console.log("refrect!")
    }
    if (prevProps.store.shouldReflect && !this.props.store.shouldReflect) {
      this.removeImageEffect('reflection');
      console.log("stop refrect!")
    }

    if (!prevProps.store.shouldRadial && this.props.store.shouldRadial) {
      console.log('start radial');
      this.addImageEffect('radial');
    }
    if (prevProps.store.shouldRadial && !this.props.store.shouldRadial) {
      this.removeImageEffect('radial');
    }
    if (!prevProps.store.shouldReset && this.props.store.shouldReset) {
      console.log('reset bg');
      this.pixiNode.removeChild(this.pixiapp.view)
      this.pixiapp.destroy()
      this.initPixi()
    }
    if (
      prevProps.store.image !== this.props.store.image
    ) {
      // Destroy the current pixi and create a new one with the new image
      if (this.pixiNode.contains(this.pixiapp.view)) {
        this.pixiNode.removeChild(this.pixiapp.view);
      }
      this.pixiapp.destroy();
      this.initPixi();
      // if (this.props.store.shouldRGB) {
      //   this.addImageEffect();
      // }
    }
  }

  initPixi = () => {
    // console.log(`${this.props.image}?q=80&fm=jpg&w=${bgwidth}&h=${window.innerHeight}&fit=crop&crop=edges`);
    if (!this.props.store.image) {
      return;
    }
    this.pixiapp = new PIXI.Application({
      width: bgwidth,
      height: window.innerHeight,
    });

    // Add the image to pixi

    const isVictor = this.props.store.dicePortalIndex === 1;
    const imageURL = `${this.props.store.image}?q=80&fm=jpg&w=${bgwidth}&h=${window.innerHeight}&fit=crop&crop=edges`;
    const coffeeImage = '../assets/coffeetable.png';

    this.pixiapp.loader.add('image', isVictor ? coffeeImage : imageURL).load((loader, resources) => {
      this.image = PIXI.Sprite.from(resources.image.url);
      this.image.width = bgwidth;
      isVictor ? this.setState({ currentImage: this.isVictor }) : this.setState({ currentImage: this.imageURL })
      // filters
      const rgb = new RGBSplitFilter(
        new PIXI.Point(0, 0),
        new PIXI.Point(0, 0),
        new PIXI.Point(0, 0),
      );

      const twisty = new TwistFilter(0, 0);
      twisty.offset = new PIXI.Point(bgwidth / 2, window.innerHeight / 2);

      const reflection = new ReflectionFilter({ mirror: true, boundary: 1, amplitude: [0, 0], });

      const center = new PIXI.Point(bgwidth / 2, window.innerHeight / 2);
      const radial = new RadialBlurFilter(0, center, 5, 0);


      this.image.filters = [rgb, twisty, reflection, radial];

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

  reflectionState = { mirror: true, boundary: 1, amplitude: [0, 0] };
  animateReflection = () => {
    if (this.reflectionState.boundary <= 1) {
      this.reflectionState.boundary = this.reflectionState.boundary - 0.0001;
    }
    if (this.reflectionState.amplitude[0] <= 50) {
      this.reflectionState.amplitude[0]++;
    }
    this.image.filters[2] = new ReflectionFilter(this.reflectionState);
  }

  radialState = { angle: 0, radius: 0, kernelSize: 23 }
  animateRadial = () => {
    if (this.radialState.angle <= 100) {
      this.radialState.angle++;
    }
    if (this.radialState.radius <= 10000) {
      this.radialState.radius++;
    }


    const center = new PIXI.Point(bgwidth / 2, window.innerHeight / 2);
    this.image.filters[3] = new RadialBlurFilter(this.radialState.angle, center, 5, this.radialState.radius, this.radialState.kernelSize);
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