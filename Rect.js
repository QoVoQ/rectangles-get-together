let rectIDCounter = 0;
class Rect {
  constructor(startX, startY, width, height) {
    this.ID = rectIDCounter++;
    this.startX = startX;
    this.startY = startY;
    this.width = width;
    this.height = height;
  }
}

window.Rect = Rect;
