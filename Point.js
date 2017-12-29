class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.positionState = []; // 盖点处于那些rect之中，[rect1ID, rect2ID,....]
  }
  fillPoint(rectID) {
    this.positionState.push(rectID);
  }
}

window.Point = Point;
