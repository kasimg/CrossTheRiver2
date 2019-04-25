(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/MainScript.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '82b3741WGtMPIfSWTJ3P/tO', 'MainScript', __filename);
// Script/MainScript.js

'use strict';

var _Data = require('static/Data');

var _Data2 = _interopRequireDefault(_Data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
  extends: cc.Component,

  properties: {
    animalPrefab: {
      default: null,
      type: cc.Prefab
    },
    // deerPrefab: {
    //   default: null,
    //   type: cc.Prefab,
    // },
    tigers: [], //  存放3只老虎
    deers: [], //  存放3只鹿
    boat: {
      default: null,
      type: cc.Node
    },
    riverBankInfo: {
      default: null
    }, //  存放两边岸上的情况
    GoBtn: {
      default: null,
      type: cc.Node
    }
  },

  //  创建角色
  creatActors: function creatActors() {
    var _this = this;

    var _loop = function _loop(i) {
      //  创建老虎
      var tiger = cc.instantiate(_this.animalPrefab);
      cc.loader.loadRes('tiger', cc.SpriteFrame, function (err, spriteFrame) {
        tiger.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });

      tiger.getComponent('Animal').mainScript = _this;
      tiger.getComponent('Animal').animalIndex = i;
      tiger.getComponent('Animal').animalType = 'tiger';
      _this.node.addChild(tiger);
      _this.tigers.push(tiger);
    };

    //  创建老虎
    for (var i = 0; i < 3; i++) {
      _loop(i);
    }

    //  创建鹿

    var _loop2 = function _loop2(i) {
      //  创建鹿
      var deer = cc.instantiate(_this.animalPrefab);
      cc.loader.loadRes('deer', cc.SpriteFrame, function (err, spriteFrame) {
        deer.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });

      deer.getComponent('Animal').mainScript = _this;
      deer.getComponent('Animal').animalIndex = i;
      deer.getComponent('Animal').animalType = 'deer';
      _this.node.addChild(deer);
      _this.deers.push(deer);
    };

    for (var i = 0; i < 3; i++) {
      _loop2(i);
    }
  },


  //  设置老虎和鹿的初始位置
  setActorPos: function setActorPos() {
    for (var i = 0; i < this.tigers.length; i++) {
      var _tiger = this.tigers[i];
      var posX = _Data2.default.tigerPositionLeft[i].x;
      var posY = _Data2.default.tigerPositionLeft[i].y;

      // tiger.x = posX;
      // tiger.y = posY;

      _tiger.setPosition(posX, posY);

      var _deer = this.deers[i];
      posX = _Data2.default.deerPositionLeft[i].x;
      posY = _Data2.default.deerPositionLeft[i].y;

      // deer.x = posX;
      // deer.y = posY;
      // console.log(deer.x, deer.y);
      _deer.setPosition(posX, posY);
    }

    //  设置船的初始位置
    this.boat.setPosition(_Data2.default.boatPositionLeft.x, _Data2.default.boatPositionLeft.y);
  },


  //  初始化河岸数组
  initRiverBankInfo: function initRiverBankInfo() {
    this.riverBankInfo = {
      left: {
        tigerNum: 3,
        deerNum: 3
      },
      right: {
        tigerNum: 0,
        deerNum: 0
      }
    };
  },


  //  初始化界面
  initBackground: function initBackground() {
    this.creatActors();
    this.setActorPos();
    this.initRiverBankInfo();
  },


  //  绑定GO按钮点击事件
  bindGoEvent: function bindGoEvent() {
    this.GoBtn.on(cc.Node.EventType.MOUSE_DOWN, this.onGoBtnClicked, this);
  },


  //  解除GO按钮点击事件
  removeGoEvent: function removeGoEvent() {
    this.GoBtn.off(cc.Node.EventType.MOUSE_DOWN, this.onGoBtnClicked, this);
  },


  //  点击GO之后的事件
  onGoBtnClicked: function onGoBtnClicked() {
    // console.log('点击了一次');
    //  根据船的位置确定往哪里走，实际操作中有可能出现误差，所以这里给出一定的余地
    if (Math.abs(this.boat.x - _Data2.default.boatPositionLeft.x) < 10) {
      //  如果在左边
      //  移动船
      this.sailTo('right');
      if (this.ifGameOver('left')) {
        this.gameOver();
      }
    } else {
      this.sailTo('left');
    }
  },


  //  移除所有动物的点击事件
  removeAnimalClickEvent: function removeAnimalClickEvent() {
    for (var i = 0; i < this.tigers.length; i++) {
      this.tigers[i].getComponent('Animal').removeClickEvent();
      this.deers[i].getComponent('Animal').removeClickEvent();
    }
  },


  //  绑定多有动物的点击事件
  bindAnimalClickEvent: function bindAnimalClickEvent() {
    for (var i = 0; i < this.tigers.length; i++) {
      this.tigers[i].getComponent('Animal').bindClickEvent();
      this.deers[i].getComponent('Animal').bindClickEvent();
    }
  },


  //  点击按钮移动船
  sailTo: function sailTo(pos) {
    var _this2 = this;

    var boatIns = this.boat.getComponent('Boat');
    var boatStr = 'boatPosition' + (pos === 'right' ? 'Right' : 'Left');
    var passageStr = pos + 'Pos';
    // console.log(Data[boatStr], boatStr);
    // console.log(pos);
    // console.log('从', {x: this.boat.x, y: this.boat.y}, '开往', Data[boatStr])
    var boatSailAction = boatIns.sail({
      delX: _Data2.default[boatStr].x - this.boat.x,
      delY: _Data2.default[boatStr].y - this.boat.y
    });

    //  移除点击事件，防止连续点击
    this.removeGoEvent();
    this.removeAnimalClickEvent();
    var se = cc.sequence(boatSailAction, cc.callFunc(function () {
      // console.log('动作执行完毕');
      //  动作执行完之后，重新绑定事件
      _this2.bindGoEvent();
      _this2.bindAnimalClickEvent();

      //  判断是否游戏结束
      // if(this.ifGameOver(pos)) {
      //   this.gameOver();
      // } else {
      //   console.log('继续');
      // }
    }, this));
    this.boat.runAction(se);

    var passages = boatIns.passages;
    // if (!boatIns.isEmpty()) {
    for (var i = 0; i < passages.length; i++) {
      if (passages[i]) {
        passages[i].sail({
          delX: boatIns.seats[passages[i].seatIndex][passageStr].x - passages[i].node.x,
          delY: boatIns.seats[passages[i].seatIndex][passageStr].y - passages[i].node.y
        });
      }
    }
    // }
  },


  // 判定游戏是否结束
  //  pos表示判断哪一岸的情况
  ifGameOver: function ifGameOver(pos) {
    var boatInfo = this.boat.getComponent('Boat');
    console.log(this.riverBankInfo, boatInfo);
    if (this.riverBankInfo[pos].tigerNum + boatInfo.boatInfo.tigerNum > this.riverBankInfo[pos].deerNum + boatInfo.boatInfo.deerNum) return true;
    return false;
  },


  //  游戏结束时执行
  gameOver: function gameOver() {
    console.log('game over');
  },
  onLoad: function onLoad() {
    this.initBackground();
    this.bindGoEvent();
    // console.log(this.tigers[0]);
    // console.log(this.tigers[0]);
    // this.tigers[0].getComponent('Animal').jump();
  },
  start: function start() {},
  update: function update(dt) {
    // console.log(this.tigers[0]);
    // this.tigers[0].getComponent('Animal').jump();
  }
}); // Learn cc.Class:
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
        //# sourceMappingURL=MainScript.js.map
        