"use strict";
cc._RF.push(module, '4c891A22JdPSa1tfq1qe617', 'Boat');
// Script/Boat.js

'use strict';

var _Data = require('Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
  extends: cc.Component,

  properties: {
    passages: [], //  存放在船上的animal对象
    boatInfo: {
      default: null
    }
  },

  //  初始化座位
  initSeats: function initSeats() {
    this.seats = [];
    for (var i = 0; i < 3; i++) {
      this.seats.push({
        index: i,
        leftPos: {
          x: _Data2.default.passagePositionLeft[i].x,
          y: _Data2.default.passagePositionLeft[i].y
        },
        rightPos: {
          x: _Data2.default.passagePositionRight[i].x,
          y: _Data2.default.passagePositionRight[i].y
        },
        occupied: false
      });
    }
  },


  //  初始化船上动物的数量信息
  initBoatStatus: function initBoatStatus() {
    this.boatInfo = {
      tigerNum: 0,
      deerNum: 0
    };
  },


  //  判断是否在左岸
  atLeft: function atLeft() {
    if (Math.abs(this.node.x - _Data2.default.boatPositionLeft.x) < 10) return true;
    return false;
  },


  //  判断船上是否有鹿
  hasDeer: function hasDeer() {
    for (var i = 0; i < this.passages.length; i++) {
      if (this.passages[i] && this.passages[i].animalType === 'deer') return true;
    }
    return false;
  },


  //  寻找空座位，如果有座位返回座位index，如果没有返回null
  searchSeat: function searchSeat() {
    for (var i = 0; i < this.seats.length; i++) {
      if (!this.seats[i].occupied) return i;
    }
    return -1;
  },


  //  判断船是否为空
  isEmpty: function isEmpty() {
    var validPassageCount = 0;
    for (var i = 0; i < this.passages.length; i++) {
      if (this.passages[i]) validPassageCount++;
    }
    if (validPassageCount < 1) return true;
    return false;
  },


  //  上船
  getOn: function getOn(passage, index) {
    // if (index !== -1) 
    this.seats[index].occupied = true;
    this.passages[index] = passage;
    passage.onBoat = true;
    passage.seatIndex = index;
  },


  //  下船
  getOff: function getOff(passage, index) {
    // console.log('index: ' + index);
    this.seats[index].occupied = false;
    this.passages[index] = null;
    passage.onBoat = false;
    passage.seatIndex = -1;
  },


  //  移动
  sail: function sail(_ref) {
    var delX = _ref.delX,
        delY = _ref.delY;

    var sailAction = cc.moveBy(3, cc.v2(delX, delY)).easing(cc.easeCubicActionOut());

    // const se = cc.sequence(sailAction, cc.callFunc(() => {
    //   // console.log('finish');
    // }, this));
    // this.node.runAction(se);
    // console.log('运动距离为:', delX, delY);
    return sailAction;
  },
  onLoad: function onLoad() {
    this.initSeats(); //  初始化座位对象
    this.initBoatStatus();
    // this.initBoatStatus();
    // console.log(this.seats);
  },
  start: function start() {}
}

// update (dt) {},
); // Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc._RF.pop();