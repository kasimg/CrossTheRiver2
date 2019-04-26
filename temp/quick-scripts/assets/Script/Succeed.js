(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Succeed.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd0ed2WYXfJIAIFBtFDVHlGh', 'Succeed', __filename);
// Script/Succeed.js

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
    againBtn: {
      default: null,
      type: cc.Label
    }
  },

  // LIFE-CYCLE CALLBACKS:

  //  鼠标进入按钮，把指针类型改变
  onMouseEnter: function onMouseEnter() {
    cc.game.canvas.style.cursor = 'pointer';
    this.againBtn.node.scale = 1.5;
    this.againBtn.node.rotation = -10;
  },


  //  鼠标离开按钮，指针类型改变
  onMouseLeave: function onMouseLeave() {
    cc.game.canvas.style.cursor = 'default';
    this.againBtn.node.scale = 1;
    this.againBtn.node.rotation = 0;
  },
  onMouseDown: function onMouseDown() {
    cc.director.loadScene('stage');
  },


  //  绑定事件
  bindEvents: function bindEvents() {
    this.againBtn.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.againBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.againBtn.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
  },
  onLoad: function onLoad() {
    this.bindEvents();
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
        //# sourceMappingURL=Succeed.js.map
        