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
      type: cc.Button,
    },
  },

  //  鼠标进入按钮，把指针类型改变
  onMouseEnter() {
    cc.game.canvas.style.cursor = 'pointer';
    this.restartBtn.node.children[0].children[0].scale = 1.5;
    this.restartBtn.node.children[0].children[0].rotation = 10;
  },

  //  鼠标离开按钮，指针类型改变
  onMouseLeave() {
    cc.game.canvas.style.cursor = 'default';
    this.restartBtn.node.children[0].children[0].scale = 1;
    this.restartBtn.node.children[0].children[0].rotation = 0;
  },

  //  点击重新开始，重新开始游戏
  onMouseClicked() {
    cc.director.loadScene('stage');
    // this.node.destroy();
  },

  //  绑定重新开始按钮事件
  bindRestartEvent() {
    this.restartBtn.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.restartBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.restartBtn.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseClicked, this);
  },

  onLoad() {
    this.bindRestartEvent();
  },

  start() {

  },

  // update (dt) {},
});
