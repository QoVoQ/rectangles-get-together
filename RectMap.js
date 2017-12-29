class RectMap {
  constructor(width, height, canvasCtx) {
    this.width = width;
    this.height = height;
    this.pointMap = []; // instances of Points
    this.rectMap = []; // instances of Rects
    this.canvasCtx = canvasCtx;
  }
  init() {
    for (let i = 0; i < this.width; i++) {
      this.pointMap[i] = [];
      for (let j = 0; j < this.height; j++) {
        this.pointMap[i][j] = new Point(i, j);
      }
    }
  }
  start() {
    function getRandomSideLength() {
      return getRandomInteger(100, 50);
    }
    const iterations = 3;
    for (let i = 0; i < iterations; i++) {
      const startPoint = this.findStartPoint();
      console.log('startPoint got --', startPoint);
      this.drawRect(
        startPoint,
        getRandomSideLength(),
        getRandomSideLength()
      );
    }
  }
  drawRect(startPoint, rectWidth, rectHeight) {
    // a) 决定rect的方向 -- 根据startPoint对角四个方向的点情况，决定新rect的方向
    // b) 决定rect的width/height -- rect的长/宽 从0->rectWidth增长，可能被已存在的rect打断增长
    // c) 更新RectMap的信息
    // d) canvas绘制rect
    //
    // startPoint:
    //  {
    //   coordinate: {
    //     x, y
    //   },
    //   priority,
    //   direction: [0|1|2|3]
    // }

    // b) 决定rect的width/height -- rect的长/宽 从0->rectWidth增长，可能被已存在的rect打断增长
    const {
      validWidth, validHeight
    } =
    findValidSideLength(startPoint, rectWidth, rectHeight, this);
    // c) 更新RectMap的信息
    const newRect = fillRectInRectMap(startPoint, validWidth, validHeight,
      this);
    // d) canvas绘制rect
    drawPoint(this.canvasCtx, startPoint.coordinate.x, startPoint.coordinate
      .y);
    drawRectOnCanvas(this.canvasCtx, newRect);
    debugger;
  }
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
      '-1': [],
      0: [],
      1: [],
      2: [],
      3: [],
      5: []
    };

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const pointPriority = checkPointPriority(this, i, j);
        // debugger;
        if (!priorityBook[pointPriority.priority]) {
          console.log(
            'new priority found in -- findStartPoint---',
            JSON.stringify(pointPriority)
          );
          priorityBook[pointPriority.priority] = [pointPriority];
        } else {
          priorityBook[pointPriority.priority].push(pointPriority);
        }
      }
    }
    console.log('priorityBook finished --', priorityBook);
    if (priorityBook[5].length) {
      return getRandomArrayElement(priorityBook[5]);
    }
    if (priorityBook[3].length) {
      return getRandomArrayElement(priorityBook[3]);
    }
    return getRandomArrayElement(priorityBook[0]);
  }
}

function getRandomInteger(max, min = 0) {
  return Math.floor(min + (max - min) * Math.random());
}

function getRandomArrayElement(array) {
  return array[getRandomInteger(array.length)];
}

function checkPointPriority(rectMap, x, y) {
  const rectMapWidth = rectMap.width;
  const rectMapHeight = rectMap.height;
  const pointMap = rectMap.pointMap;
  let priority = 0;
  let direction = [0, 1, 2, 3]; // 0 -> top-left, 1 -> top-right, 2 -> bottom-right, 3 -> bottom-left

  if (pointMap[x][y].positionState.length) {
    return {
      coordinate: {
        x, y
      },
      priority: -1,
      direction: []
    };
  }
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
  if (x + 1 >= rectMapWidth || y - 1 < 0 || pointMap[x + 1][y - 1].positionState
    .length > 0) {
    priority++;
    direction[1] = false;
  }
  // check right point
  if (x + 1 >= rectMapWidth || pointMap[x + 1][y].positionState.length > 0) {
    priority++;
  }
  // check bottom-right point
  if (x + 1 >= rectMapWidth || y + 1 >= rectMapHeight || pointMap[x + 1][y + 1]
    .positionState
    .length > 0) {
    priority++;
    direction[2] = false;
  }
  // check bottom point
  if (y + 1 >= rectMapHeight || pointMap[x][y + 1].positionState.length > 0) {
    priority++;
  }
  // check bottom-left point
  if (x - 1 < 0 || y + 1 >= rectMapHeight || pointMap[x - 1][y + 1].positionState
    .length > 0) {
    priority++;
    direction[3] = false;
  }
  // check left point
  if (x - 1 < 0 || pointMap[x - 1][y].positionState.length > 0) {
    priority++;
  }

  if (x - 1 < 0 || y - 1 < 0 || x + 1 >= rectMapWidth || y + 1 >= rectMapHeight) {
    priority = -10;
  }

  direction = direction.filter(dir => dir !== false);

  return {
    coordinate: {
      x, y
    },
    priority,
    direction: getRandomArrayElement(direction)
  };
}

// check if the point out of range
function isPointValid(x, y, rectMap) {
  return x >= 0 && x < rectMap.width && y >= 0 && y < rectMap.height;
}

function isPointEmpty(x, y, rectMap) {
  return isPointValid(x, y, rectMap) && !rectMap.pointMap[x][y].positionState.length;
}

function getDirectionDelta(direction) {
  const self = val => val;
  const opposite = val => -val;
  switch (+direction) {
    case 0: // top-left
      return {
        dx: opposite,
        dy: opposite
      };
    case 1: // top-right
      return {
        dx: self,
        dy: opposite
      };
    case 2: // bottom-right
      return {
        dx: self,
        dy: self
      };
    case 3: // bottom-left
      return {
        dx: opposite,
        dy: self
      };
    default:
      throw new Error('unknow direction ...');
  }
}
// find valid widht/height
function findValidSideLength(startPoint, rectWidth, rectHeight, rectMap) {
  let validWidth = rectWidth,
    validHeight = rectHeight;
  const {
    direction, priority, coordinate
  } = startPoint;
  const pointMap = rectMap.pointMap;
  const {
    dx, dy
  } = getDirectionDelta(direction);
  // find valid width from 0 to rectWidth
  for (let i = 1; i <= rectWidth; i++) {
    if (!isPointEmpty(coordinate.x + dx(i), coordinate.y, rectMap)) {
      if (!isPointValid(coordinate.x + dx(i), coordinate.y, rectMap)) {
        i--;
      }
      validWidth = i;
      if (validWidth === 1 || validHeight === 1) {
        debugger;
      }
      break;
    }
  }

  // find valid height from 0 to rectHeight
  for (let i = 1; i <= rectHeight; i++) {
    if (!isPointEmpty(coordinate.x, coordinate.y + dy(i), rectMap)) {
      if (!isPointValid(coordinate.x, coordinate.y + dy(i), rectMap)) {
        i--;
      }
      validHeight = i;
      if (validWidth === 1 || validHeight === 1) {
        debugger;
      }
      break;
    }
  }

  return {
    validWidth,
    validHeight
  };
}

function fillRectInRectMap(startPoint, validWidth, validHeight, rectMap) {
  const {
    direction, priority, coordinate
  } = startPoint;
  const pointMap = rectMap.pointMap;
  const {
    dx, dy
  } = getDirectionDelta(direction);

  // generate new rect
  const newRect = new Rect(
    coordinate.x + dx(validWidth) * (direction === 1 || direction === 3),
    coordinate.y + dy(validHeight) * (direction === 0 || direction === 1),
    validWidth,
    validHeight
  );

  console.log('new rect created', newRect);

  // 0
  // x + dx, y + dy
  // 1
  // x, y + dy
  // 2
  // x, y
  // 3
  // x + dx, y

  rectMap.rectMap.push(newRect);

  for (let i = 0; i < validWidth; i++) {
    for (let j = 0; j < validHeight; j++) {
      pointMap[coordinate.x + dx(i)][coordinate.y + dy(j)]
        .positionState.push(newRect.ID);
    }
  }

  return newRect;
}

function getRandomColor() {
  return `#${getRandomInteger(256).toString(16)}` +
    `${getRandomInteger(256).toString(16)}` +
    `${getRandomInteger(256).toString(16)}`;
}

function drawPoint(ctx, x, y) {
  const color = getRandomColor();
  ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawRectOnCanvas(ctx, rect) {
  const color = getRandomColor();
  ctx.fillStyle = color;
  ctx.fillRect(rect.startX, rect.startY, rect.width, rect.height);
}

window.RectMap = RectMap;
