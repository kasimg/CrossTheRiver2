(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Animal.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '39049FDSS5DxI+Q4YZRMzOy', 'Animal', __filename);
// Script/Animal.js

'use strict';

var _Data = require('static/Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
  extends: cc.Component,

  properties: {},

  //  判断是否在左岸
  atLeft: function atLeft() {
    //  根据动物类型和创建时的索引确定左岸自己的位置
    var leftPos = this.animalType === 'tiger' ? _Data2.default.tigerPositionLeft[this.animalIndex] : _Data2.default.deerPositionLeft[this.animalIndex];

    if (Math.abs(this.node.x - leftPos.x) < 10) return true;
    return false;
  },


  //  跳跃行为
  jump: function jump(_ref) {
    var _ref$delX = _ref.delX,
        delX = _ref$delX === undefined ? 0 : _ref$delX,
        _ref$delY = _ref.delY,
        delY = _ref$delY === undefined ? 0 : _ref$delY;

    // console.log('jump')
    var jumpAction = cc.moveBy(1, cc.v2(delX, delY)).easing(cc.easeCubicActionOut());

    this.node.runAction(jumpAction);
    // this.computeDelPos();
  },


  //  上船行为
  getOnTheBoatFrom: function getOnTheBoatFrom(pos) {
    var boat = this.mainScript.boat.getComponent('Boat');
    // const bankInfo = 
    var seatIndex = boat.searchSeat();
    if (seatIndex !== -1) {
      boat.getOn(this, seatIndex);
      // console.log('get on the boat');
      //  跳上船
      this.jump(this.computeDelPos({ x: this.node.x, y: this.node.y }, boat.seats[this.seatIndex][pos === 'left' ? 'leftPos' : 'rightPos']));
      //  更新岸上和船上的动物数量信息
    }
  },


  //  下船行为
  getOffTheBoatFrom: function getOffTheBoatFrom(pos) {
    var boat = this.mainScript.boat.getComponent('Boat');
    // console.log('get off the boat');
    boat.getOff(this, this.seatIndex);

    //  跳下船
    var animalStr = this.animalType === 'tiger' ? 'tigerPosition' : 'deerPosition';
    var directionStr = pos === 'left' ? 'Left' : 'Right';
    this.jump(this.computeDelPos({ x: this.node.x, y: this.node.y }, _Data2.default[animalStr + directionStr][this.animalIndex]));
  },


  //  更新船上和岸上的动物数量信息
  //  getOn表示是否往船上跳，默认为true
  updateAnimalNum: function updateAnimalNum(pos) {
    var getOn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var bankInfo = this.mainScript.riverBankInfo;
    var boatInfo = this.mainScript.boat.getComponent('Boat').boatInfo;
    // console.log(bankInfo, boatInfo, this.mainScript.boat.getComponent('Boat'));

    var animalStr = this.animalType + 'Num';
    var addFlag = getOn ? 1 : -1;
    bankInfo[pos][animalStr] -= 1 * addFlag;
    boatInfo[animalStr] += 1 * addFlag;

    console.log(bankInfo, boatInfo);
  },


  //  点击GO之后的移动行为
  sail: function sail(_ref2) {
    var delX = _ref2.delX,
        delY = _ref2.delY;

    var sailAction = cc.moveBy(1, cc.v2(delX, delY)).easing(cc.easeCubicActionOut());

    this.node.runAction(sailAction);
  },


  //  点击精灵的相应事件
  //  决定是上船还是下船，应该往哪里跳
  onClicked: function onClicked() {
    // console.log('动物被点击');
    //  存放boat
    var boat = this.mainScript.boat.getComponent('Boat');
    // this.atLeft();
    // console.log(boat.atLeft());
    //  如果船在左岸
    // console.log(this.onBoat);
    if (boat.atLeft()) {
      // console.log('船在左岸');
      // console.log(this.onBoat);
      if (this.onBoat) {
        //  此时一定是在船上，而且是在左边
        // console.log('动物在船上');
        this.getOffTheBoatFrom('left');
        this.updateAnimalNum('left', false);
      } else if (this.atLeft()) {
        //  否则在岸上
        // console.log('动物在岸上');
        this.getOnTheBoatFrom('left');
        this.updateAnimalNum('left');
      }
    } else {
      //  船在右岸
      // console.log('船在右岸');
      if (this.onBoat) {
        //  在船上，且在右边
        this.getOffTheBoatFrom('right');
        this.updateAnimalNum('right', false);
      } else if (!this.atLeft()) {
        //  不在船上，在右岸上
        // console.log('动物在右岸')
        this.getOnTheBoatFrom('right');
        this.updateAnimalNum('right');
      }
    }
  },


  //  计算位移量
  computeDelPos: function computeDelPos(_ref3, _ref4) {
    var xBefore = _ref3.x,
        yBefore = _ref3.y;
    var xAfter = _ref4.x,
        yAfter = _ref4.y;

    return {
      delX: xAfter - xBefore,
      delY: yAfter - yBefore
    };
  },


  //  绑定鼠标点击跳跃时间
  bindClickEvent: function bindClickEvent() {
    this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onClicked, this);
  },


  //  移除鼠标点击事件
  removeClickEvent: function removeClickEvent() {
    this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onClicked, this);
  },


  // LIFE-CYCLE CALLBACKS:

  onLoad: function onLoad() {
    this.bindClickEvent();
    // console.log(this.atLeft());
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Animal.js.map
        