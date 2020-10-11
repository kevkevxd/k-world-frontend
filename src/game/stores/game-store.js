import { observable } from "mobx";
//observable defines a trackable field that stores the state.
class GameStore {
  //these are states
  characterPosition = observable({ x: 0, y: 0 });
  stageX = observable(0);
  portalPosition = observable({ x: 0, y: 0 });
  isPortalOpen = observable(false);

  //these set states
  setCharacterPosition(position) {
    this.characterPosition = position;
  }

  setStageX(x) {
    //movement gets stuck w/o this
    if (x > 0) {
      this.stageX = 0;
    } else if (x < -2048) {
      this.stageX = -2048;
    } else {
      this.stageX = x;
    }
  }

  setPortalPosition(position) {
    this.portalPosition = position;
  }

  openPortal() {
    const newPortalPosition = {
      x: this.characterPosition.x + 500,
      y: this.characterPosition.y - 40,
    };
    this.setPortalPosition(newPortalPosition);
    this.isPortalOpen = true;
  }

  closePortal() {
    this.isPortalOpen = false;
  }

  checkEnterPortal() {
    if (
      this.characterPosition.x >= this.portalPosition.x - 20 &&
      this.characterPosition.x <= this.portalPosition.x + 20
    ) {
      this.closePortal();
    }
  }
}

export default new GameStore();
//this is a new instance "active"
