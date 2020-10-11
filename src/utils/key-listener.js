export default class KeyListener {
  LEFT = "ArrowLeft";
  RIGHT = "ArrowRight";
  UP = "ArrowUp";
  DOWN = "ArrowDown";
  SPACE = " ";
  CTRL = "Control";
  A = "a";

  constructor() {
    this.keys = {};

    this.down = this.down.bind(this);
    this.up = this.up.bind(this);
    this.isDown = this.isDown.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  down(event) {
    if (event.key in this.keys) {
      event.preventDefault();
      this.keys[event.key] = true;
    }
  }

  up(event) {
    if (event.key in this.keys) {
      event.preventDefault();
      this.keys[event.key] = false;
    }
  }

  isDown(key) {
    return this.keys[key] || false;
  }

  subscribe(keys) {
    window.addEventListener("keydown", this.down);
    window.addEventListener("keyup", this.up);

    keys.forEach((key) => {
      this.keys[key] = false;
    });
  }

  unsubscribe() {
    window.removeEventListener("keydown", this.down);
    window.removeEventListener("keyup", this.up);
    this.keys = {};
  }
}
