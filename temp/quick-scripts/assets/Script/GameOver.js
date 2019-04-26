(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/GameOver.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '182fcnI9I9GhZL8aPz7SzWi', 'GameOver', __filename);
// Script/GameOver.js

'use strict';

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    restartBtn: {
      default: null,
      type: cc.Button
    }
  },

  //  鼠标进入按钮，把指针类型改变
  onMouseEnter: function onMouseEnter() {
    cc.game.canvas.style.cursor = 'pointer';
    this.restartBtn.node.children[0].children[0].scale = 1.5;
    this.restartBtn.node.children[0].children[0].rotation = 10;
  },


  //  鼠标离开按钮，指针类型改变
  onMouseLeave: function onMouseLeave() {
    cc.game.canvas.style.cursor = 'default';
    this.restartBtn.node.children[0].children[0].scale = 1;
    this.restartBtn.node.children[0].children[0].rotation = 0;
  },


  //  点击重新开始，重新开始游戏
  onMouseClicked: function onMouseClicked() {
    cc.director.loadScene('stage');
    // this.node.destroy();
  },


  //  绑定重新开始按钮事件
  bindRestartEvent: function bindRestartEvent() {
    this.restartBtn.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.restartBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.restartBtn.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseClicked, this);
  },
  onLoad: function onLoad() {
    this.bindRestartEvent();
  },
  start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=GameOver.js.map
        