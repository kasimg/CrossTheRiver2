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
      type: cc.Label,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  //  鼠标进入按钮，把指针类型改变
  onMouseEnter() {
    cc.game.canvas.style.cursor = 'pointer';
    this.againBtn.node.scale = 1.5;
    this.againBtn.node.rotation = -10;
  },

  //  鼠标离开按钮，指针类型改变
  onMouseLeave() {
    cc.game.canvas.style.cursor = 'default';
    this.againBtn.node.scale = 1;
    this.againBtn.node.rotation = 0;
  },

  onMouseDown() {
    cc.director.loadScene('stage');
  },

  //  绑定事件
  bindEvents() {
    this.againBtn.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.againBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    this.againBtn.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
  },

  onLoad () {
    this.bindEvents();
  }, 

  start() {

  },

  // update (dt) {},
});
