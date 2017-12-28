class RectMap {
  constructor(width, height) {
      this.width = width;
      this.height = height;
      this.pointMap = []; // instances of Points
      this.rectMap = []; // instances of Rects
    },
    init() {
      for (let i = 0; i < this.width; i++) {
        this.map[i] = [];
        for (let j = 0; j < this.height; j++) {
          this.map[i][j] = new Point(x, y);
        }
      }
    },
    drawRect(startPoint, rectWidth, rectHeight) {
      // a) 决定rect的方向 -- 根据startPoint对角四个方向的点情况，决定新rect的方向
      // b) 决定rect的width/height -- rect的长/宽 从0->rectWidth增长，可能被已存在的rect打断增长
      // c) 更新RectMap的信息
      // d) canvas绘制rect

      // draw direction -- bottom-right
      let direction = 2;
      if (direction === 2) {

      }

    },
    findStartPoint() {
      /**
       * return start point and start direction 0|1|2|3|4|5|6|7|8
       * 0 -> top-left, 1 -> top, 2 -> top-right, 3 -> right
       * a) search the whole pointMap, for every single Point, caculate its pirority.
       *    Points of highest pirority will be randomly selected as output.
       * b) Check its nearest adjacent Point in all eight directions. If a adjacent
       *    Point is already in a Rect, the original Point gain one score(0|3|5|7|8)
       */
      // for priority0, no rect on the canva, randomly chose on as output
      // for priority8, no more rect can start from this Point
      // priority other possible value 3 7
      const priorityBook = {
        0: [],
        3: [],
        5: [],
        7: [],
        8: []
      };

      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          const pointPriority = checkPointPriority(this.pointMap, i, j);
          if (!priorityBook[pointPriority.priority]) {
            priorityBook[pointPriority.priority] = [pointPriority];
          } else {
            priorityBook[pointPriority.priority].push(pointPriority);
          }
        }
      }

      if (priorityBook[7].length) {
        return priorityBook[7].[getRandomInteger(priorityBook[7].length)];
      }
      if (priorityBook[5].length) {
        return priorityBook[5].[getRandomInteger(priorityBook[5].length)];
      }
      return return priorityBook[0].[getRandomInteger(priorityBook[0].length)];
    }
}

function getRandomInteger(max, min = 0) {
  return Math.floor(min + (max - min) * Math.random());
}

function checkPointPriority(rectMap, x, y) {
  const rectMapWidth = rectMap.width;
  const rectMapHeight = rectMap.height;
  const pointMap = rectMap.pointMap;
  let priority = 0;
  let direction = [0, 1, 2, 3]; // 0 -> top-left, 1 -> top-right, 2 -> bottom-right, 3 -> bottom-left
  // check top-left diagonal point
  if (x - 1 < 0 || y - 1 < 0 || pointMap[x - 1][y - 1].positionState.length > 0) {
    priority++;
    direction[0] = false;
  }
  // check top point
  if (y - 1 < 0 || pointMap[x][y - 1].positionState.length > 0) {
    priority++;
  }
  // check top-right point
  if (x + 1 > rectMapWidth || y - 1 < 0 || pointMap[x + 1][y - 1].positionState
    .length > 0) {
    priority++;
    direction[1] = false;
  }
  // check right point
  if (x + 1 > rectMapWidth || pointMap[x + 1][y].positionState.length > 0) {
    priority++;
  }
  // check bottom-right point
  if (x + 1 > rectMapWidth || y + 1 > rectMapHeight || pointMap[x + 1][y + 1].positionState
    .length > 0) {
    priority++;
    direction[2] = false;
  }
  // check bottom point
  if (y + 1 > rectMapWidth || pointMap[x][y + 1].positionState.length > 0) {
    priority++;
  }
  // check bottom-left point
  if (x - 1 < 0 || y + 1 > rectMapHeight || pointMap[x - 1][y + 1].positionState
    .length > 0) {
    priority++;
    direction[3] = false;
  }
  // check left point
  if (x - 1 < 0 || pointMap[x - 1][y].positionState.length > 0) {
    priority++;
  }

  return {
    coordinate: {
      x, y
    },
    priority,
    direction: direction.filter(dir => dir !== false)
  }
}

function getHalfVector(vector) {
  return {
    x: vector.x / 2,
    y: vector.y / 2
  };
}

function findUsableSideLengthBinary(pointMap, start, vector) {
  if (pointMap[start.x + vector.x][start.y + vector.y].positionState.length) {
    return findUsableSideLengthBinary(pointMap, start, getHalfVector(vecotr));
  }
  return vector.x || vector.y;
}

window.RectMap = RectMap;
