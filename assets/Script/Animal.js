// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Data from 'Data';
cc.Class({
  extends: cc.Component,

  properties: {

  },

  //  判断是否在左岸
  atLeft() {
    //  根据动物类型和创建时的索引确定左岸自己的位置
    const leftPos = this.animalType === 'tiger'
      ? Data.tigerPositionLeft[this.animalIndex]
      : Data.deerPositionLeft[this.animalIndex];

    if (Math.abs(this.node.x - leftPos.x) < 10) return true;
    return false;
  },

  //  跳跃行为
  jump({ delX = 0, delY = 0 }) {
    // console.log('jump')
    const jumpAction = cc
      .moveBy(1, cc.v2(delX, delY))
      .easing(cc.easeCubicActionOut());

    //  先取消所有动物的点击事件，防止疯狂点击
    this.mainScript.removeAnimalClickEvent();
    this.node.runAction(cc.sequence(jumpAction, cc.callFunc(() => {
      //  如果是开往右岸，则判断是否游戏胜利
      if (this.mainScript.ifSucceeded()) {
        this.mainScript.succeed();
      }
      //  恢复动物点击事件
      this.mainScript.bindAnimalClickEvent();
    }, this)));
    // this.computeDelPos();
  },

  //  上船行为
  getOnTheBoatFrom(pos) {
    const boat = this.mainScript.boat.getComponent('Boat');
    // const bankInfo = 
    const seatIndex = boat.searchSeat();
    if (seatIndex !== -1) {
      boat.getOn(this, seatIndex);
      // console.log('get on the boat');
      //  跳上船
      this.jump(this.computeDelPos({ x: this.node.x, y: this.node.y }, boat.seats[this.seatIndex][pos === 'left' ? 'leftPos' : 'rightPos']));
      //  更新岸上和船上的动物数量信息
    }
  },

  //  下船行为
  getOffTheBoatFrom(pos) {
    const boat = this.mainScript.boat.getComponent('Boat');
    // console.log('get off the boat');
    boat.getOff(this, this.seatIndex);

    //  跳下船
    const animalStr = this.animalType === 'tiger' ? 'tigerPosition' : 'deerPosition';
    const directionStr = pos === 'left' ? 'Left' : 'Right';
    this.jump(this.computeDelPos(
      { x: this.node.x, y: this.node.y },
      Data[animalStr + directionStr][this.animalIndex],
    ));
  },

  //  更新船上和岸上的动物数量信息
  //  getOn表示是否往船上跳，默认为true
  updateAnimalNum(pos, getOn = true) {
    const bankInfo = this.mainScript.riverBankInfo;
    const boatInfo = this.mainScript.boat.getComponent('Boat').boatInfo;
    // console.log(bankInfo, boatInfo, this.mainScript.boat.getComponent('Boat'));

    const animalStr = this.animalType + 'Num';
    const addFlag = getOn ? 1 : -1;
    bankInfo[pos][animalStr] -= 1 * addFlag;
    boatInfo[animalStr] += 1 * addFlag;

    // console.log(bankInfo, boatInfo);
  },

  //  点击GO之后的移动行为
  sail({ delX, delY }) {
    const sailAction = cc
      .moveBy(1, cc.v2(delX, delY))
      .easing(cc.easeCubicActionOut());

    this.node.runAction(sailAction);
    // return sailAction;
  },

  //  点击精灵的相应事件
  //  决定是上船还是下船，应该往哪里跳
  onClicked() {
    // console.log('动物被点击');
    //  存放boat
    const boat = this.mainScript.boat.getComponent('Boat');
    // this.atLeft();
    // console.log(boat.atLeft());
    //  如果船在左岸
    // console.log(this.onBoat);
    if (boat.atLeft()) {
      // console.log('船在左岸');
      // console.log(this.onBoat);
      if (this.onBoat) {  //  此时一定是在船上，而且是在左边
        // console.log('动物在船上');
        this.getOffTheBoatFrom('left');
        this.updateAnimalNum('left', false);
      } else if (this.atLeft()) {  //  否则在岸上
        // console.log('动物在岸上');
        this.getOnTheBoatFrom('left');
        this.updateAnimalNum('left');
      }
    } else {  //  船在右岸
      // console.log('船在右岸');
      if (this.onBoat) {  //  在船上，且在右边
        this.getOffTheBoatFrom('right');
        this.updateAnimalNum('right', false);
      } else if (!this.atLeft()) {  //  不在船上，在右岸上
        // console.log('动物在右岸')
        this.getOnTheBoatFrom('right');
        this.updateAnimalNum('right');
      }
    }
  },

  //  计算位移量
  computeDelPos({ x: xBefore, y: yBefore }, { x: xAfter, y: yAfter }) {
    return {
      delX: xAfter - xBefore,
      delY: yAfter - yBefore,
    };
  },

  //  绑定鼠标点击跳跃事件
  bindClickEvent() {
    this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onClicked, this);
  },

  //  移除鼠标点击事件
  removeClickEvent() {
    this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onClicked, this);
  },

  //  鼠标移动到动物身上后的事件
  onMouseEnter() {
    cc.game.canvas.style.cursor = 'pointer';
    //  弹跳效果
    const action1 = cc.scaleBy(0.2, 1.2);
    const action2 = cc.scaleBy(0.3, 5 / 6);
    //  取消悬停事件
    this.removeMouseEnterEvent();
    const se = cc.sequence(action1, action2, cc.callFunc(() => {
      this.bindMouseEnterEvent();
    }, this));
    this.node.runAction(se);

    //  发出声音
    const soundType = this.animalType === 'tiger' ? 'tigerRoar' : 'deerSound';
    this.node.parent.getChildByName('audioControl').getComponent('AudioControl')[soundType].play();
    // console.log(this.node.parent.getChildByName('audioControl'));
  },

  //  鼠标移出动物后的事件
  onMouseLeave() {
    cc.game.canvas.style.cursor = 'default';
  },

  //  绑定鼠标悬停和移出事件事件
  bindMouseEnterEvent() {
    this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);

  },

  //  移除鼠标悬停事件
  removeMouseEnterEvent() {
    this.node.off(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
  },

  /**
   * 老虎吃鹿的动画
   * @param {number} delX 横向位移量
   * @param {number} delY 纵向位移量
   * @return {} 动作对象
   */
  eatDeer({ delX, delY }) {
    const eatAction = cc.moveBy(1, delX, delY);
    return eatAction;
  },

  onLoad() {
    this.bindClickEvent();
    this.bindMouseEnterEvent();
    // console.log(this.atLeft());
  },

  start() {

  },

  // update (dt) {},
});
