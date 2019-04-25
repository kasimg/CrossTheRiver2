// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Data from 'static/Data';
cc.Class({
  extends: cc.Component,

  properties: {
    passages: [],  //  存放在船上的animal对象
    boatInfo: {
      default: null,
    },
  },

  //  初始化座位
  initSeats() {
    this.seats = [];
    for (let i = 0; i < 3; i++) {
      this.seats.push({
        index: i,
        leftPos: {
          x: Data.passagePositionLeft[i].x,
          y: Data.passagePositionLeft[i].y,
        },
        rightPos: {
          x: Data.passagePositionRight[i].x,
          y: Data.passagePositionRight[i].y,
        },
        occupied: false,
      });
    }
  },

  //  初始化船上动物的数量信息
  initBoatStatus() {
    this.boatInfo = {
      tigerNum: 0,
      deerNum: 0,
    };
  },


  //  判断是否在左岸
  atLeft() {
    if (Math.abs(this.node.x - Data.boatPositionLeft.x) < 10) return true;
    return false;
  },
  
  //  寻找空座位，如果有座位返回座位index，如果没有返回null
  searchSeat() {
    for (let i = 0; i < this.seats.length; i++) {
      if (!this.seats[i].occupied) return i;
    }
    return -1;
  },

  //  判断船是否为空
  isEmpty() {
    let validPassageCount = 0;
    for (let i = 0; i < this.passages.length; i++) {
      if (this.passages[i]) validPassageCount++;
    }
    if (validPassageCount < 1) return true;
    return false;
  },

  //  上船
  getOn(passage, index) {
    // if (index !== -1) 
    this.seats[index].occupied = true;
    this.passages[index] = passage;
    passage.onBoat = true;
    passage.seatIndex = index;
  },

  //  下船
  getOff(passage, index) {
    // console.log('index: ' + index);
    this.seats[index].occupied = false;
    this.passages[index] = null;
    passage.onBoat = false;
    passage.seatIndex = -1;
  },

  //  移动
  sail({ delX, delY }) {
    const sailAction = cc
      .moveBy(1, cc.v2(delX, delY))
      .easing(cc.easeCubicActionOut());

    // const se = cc.sequence(sailAction, cc.callFunc(() => {
    //   // console.log('finish');
    // }, this));
    // this.node.runAction(se);
    // console.log('运动距离为:', delX, delY);
    return sailAction;
  },

  onLoad () {
    this.initSeats();  //  初始化座位对象
    this.initBoatStatus();
    // this.initBoatStatus();
    // console.log(this.seats);
  },

  start() {

  },

  // update (dt) {},
});
