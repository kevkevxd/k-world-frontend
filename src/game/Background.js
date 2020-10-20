import React from "react";
import * as PIXI from 'pixi.js';
import { RGBSplitFilter } from "pixi-filters";

class Background extends React.Component {
    componentDidUpdate(prevProps) {
        if (!prevProps.shouldAnimateBackground && this.props.shouldAnimateBackground) {
            this.initPixi();
        }

        if (
            this.props.shouldAnimateBackground &&
            prevProps.image !== this.props.image
        ) {
            // Destroy the current pixi and create a new one with the new image
            this.pixiNode.removeChild(this.pixiapp.view);
            this.pixiapp.destroy();
            this.initPixi();
        }
    }

    initPixi = () => {

        console.log('initpixi', this.props.image);

        this.pixiapp = new PIXI.Application({
            resizeTo: window,
        });

        this.pixiapp.loader.add('image', `${this.props.image}&w=1400&fit=max`).load((loader, resources) => {
            const image = PIXI.Sprite.from(resources.image.url);

            const filter1 = new RGBSplitFilter(
                new PIXI.Point(0, 0),
                new PIXI.Point(0, 0),
                new PIXI.Point(0, 0),
            );

            image.filters = [filter1];

            // Add the image to the scene we are building
            this.pixiapp.stage.addChild(image);

            const min = {
                red: {
                    x: -20,
                    y: -10,
                },
                green: {
                    x: -20,
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
                    x: 8,
                    y: 2,
                },
                blue: {
                    x: 20,
                    y: 10,
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
            let currentListIndex = 0;

            // Listen for frame updates
            this.pixiapp.ticker.add(() => {
                const updateCoordinates = (color, axis) => {
                    let currentAxis = image.filters[0][color][axis];

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

                const currentShift = list[currentListIndex];

                image.filters[0][currentShift].set(updateCoordinates(currentShift, 'x'), updateCoordinates(currentShift, 'y'));

                currentListIndex++;
                currentListIndex = currentListIndex % list.length;
            });
        });

        // Attach the pixi app to pixiNode
        if (this.pixiNode && this.pixiNode.children.length <= 0) {
            this.pixiNode.appendChild(
                this.pixiapp.view
            );
        }
    }

    render() {
        return (
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: !this.props.shouldAnimateBackground && `url(${this.props.image
                    }&w=1400&fit=max) center / cover no-repeat`,
            }} id="pixi" ref={node => { this.pixiNode = node }}></div>
        );
    }

}

export default Background;