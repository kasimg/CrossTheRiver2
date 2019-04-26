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
    animalPrefab: {
      default: null,
      type: cc.Prefab,
    },
    // deerPrefab: {
    //   default: null,
    //   type: cc.Prefab,
    // },
    tigers: [],  //  存放3只老虎
    deers: [],  //  存放3只鹿
    boat: {
      default: null,
      type: cc.Node,
    },
    riverBankInfo: {
      default: null,
    },  //  存放两边岸上的情况
    GoBtn: {
      default: null,
      type: cc.Node,
    },
    rulesBtn: {  //  点击弹出游戏规则
      default: null,
      type: cc.Label,
    },
    ruleContext: {
      default: null,
      type: cc.RichText,
    }
  },

  //  创建角色
  creatActors() {
    //  创建老虎
    for (let i = 0; i < 3; i++) {
      //  创建老虎
      const tiger = cc.instantiate(this.animalPrefab);
      cc.loader.loadRes('tiger', cc.SpriteFrame, (err, spriteFrame) => {
        tiger.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });

      tiger.getComponent('Animal').mainScript = this;
      tiger.getComponent('Animal').animalIndex = i;
      tiger.getComponent('Animal').animalType = 'tiger';
      this.node.addChild(tiger);
      this.tigers.push(tiger);
    }

    //  创建鹿
    for (let i = 0; i < 3; i++) {
      //  创建鹿
      const deer = cc.instantiate(this.animalPrefab);
      cc.loader.loadRes('deer', cc.SpriteFrame, (err, spriteFrame) => {
        deer.getComponent(cc.Sprite).spriteFrame = spriteFrame;
      });

      deer.getComponent('Animal').mainScript = this;
      deer.getComponent('Animal').animalIndex = i;
      deer.getComponent('Animal').animalType = 'deer';
      this.node.addChild(deer);
      this.deers.push(deer);
    }
  },

  //  设置老虎和鹿的初始位置
  setActorPos() {
    for (let i = 0; i < this.tigers.length; i++) {
      const tiger = this.tigers[i];
      let posX = Data.tigerPositionLeft[i].x;
      let posY = Data.tigerPositionLeft[i].y;

      // tiger.x = posX;
      // tiger.y = posY;

      tiger.setPosition(posX, posY);

      const deer = this.deers[i];
      posX = Data.deerPositionLeft[i].x;
      posY = Data.deerPositionLeft[i].y;

      // deer.x = posX;
      // deer.y = posY;
      // console.log(deer.x, deer.y);
      deer.setPosition(posX, posY);

    }

    //  设置船的初始位置
    this.boat.setPosition(Data.boatPositionLeft.x, Data.boatPositionLeft.y);
  },

  //  初始化河岸数组
  initRiverBankInfo() {
    this.riverBankInfo = {
      left: {
        tigerNum: 3,
        deerNum: 3,
      },
      right: {
        tigerNum: 0,
        deerNum: 0,
      },
    };
  },

  //  初始化界面
  initBackground() {
    this.creatActors();
    this.setActorPos();
    this.initRiverBankInfo();
  },

  //  绑定GO按钮点击事件
  bindGoEvent() {
    this.GoBtn.on(cc.Node.EventType.MOUSE_DOWN, this.onGoBtnClicked, this);
  },

  //  解除GO按钮点击事件
  removeGoEvent() {
    this.GoBtn.off(cc.Node.EventType.MOUSE_DOWN, this.onGoBtnClicked, this);
  },

  //  鼠标悬停事件
  onMouseEnter() {
    cc.game.canvas.style.cursor = 'pointer';
    this.GoBtn.scale = 0.21;
    // this.GoBtn.runAction(cc.scaleBy(0.2, 1.2));
  },

  //  鼠标离开事件
  onMouseLeave() {
    cc.game.canvas.style.cursor = 'default';
    this.GoBtn.scale = 0.19;
    // this.GoBtn.runAction(cc.scaleBy(0.2, 5 / 6));
  },

  //  绑定悬停和离开事件
  bindEnterAndLeave() {
    this.GoBtn.on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.GoBtn.on(cc.Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
  },

  //  注销悬停和离开事件

  //  点击GO之后的事件
  onGoBtnClicked() {
    // console.log('点击了一次');
    if (this.boat.getComponent('Boat').hasDeer()) {  //  只有船上有鹿的时候才能开船
      //  根据船的位置确定往哪里走，实际操作中有可能出现误差，所以这里给出一定的余地
      if (Math.abs(this.boat.x - Data.boatPositionLeft.x) < 10) {  //  如果在左边
        //  移动船
        this.sailTo('right');
        //  离开左岸的判定
        if (this.ifGameOver('left', 'leave')) {
          this.gameOver('left', 'leave');
        }
      } else {
        this.sailTo('left');
        //  离开右岸的判定
        if (this.ifGameOver('right', 'leave')) {
          this.gameOver('right', 'leave');
        }
      }
    }
  },

  //  移除所有动物的点击事件
  removeAnimalClickEvent() {
    // console.log('remove');
    for (let i = 0; i < this.tigers.length; i++) {
      this.tigers[i].getComponent('Animal').removeClickEvent();
      this.deers[i].getComponent('Animal').removeClickEvent();
    }
  },

  //  绑定多有动物的点击事件
  bindAnimalClickEvent() {
    for (let i = 0; i < this.tigers.length; i++) {
      this.tigers[i].getComponent('Animal').bindClickEvent();
      this.deers[i].getComponent('Animal').bindClickEvent();
    }
  },

  /**
   * 向指定方向航行指定的路程
   * @param {string} pos 航行的方向，可以为'left'或者’right‘
   * @param {boolean} allTheWay 是否航行全程，默认为true
   */
  sailTo(pos, allTheWay = true) {
    const boatIns = this.boat.getComponent('Boat');
    const boatStr = 'boatPosition' + (pos === 'right' ? 'Right' : 'Left');
    const passageStr = pos + 'Pos';
    // console.log(Data[boatStr], boatStr);
    // console.log(pos);
    // console.log('从', {x: this.boat.x, y: this.boat.y}, '开往', Data[boatStr])
    const boatSailAction = boatIns.sail({
      delX: Data[boatStr].x - this.boat.x,
      delY: Data[boatStr].y - this.boat.y,
    });

    //  移除点击事件，防止连续点击
    this.removeGoEvent();
    this.removeAnimalClickEvent();
    // const actionArr = [];
    // actionArr.push(boatSailAction);
    const se = cc.sequence(boatSailAction, cc.callFunc(() => {
      // console.log('动作执行完毕');
      //  动作执行完之后，重新绑定事件
      this.bindGoEvent();
      this.bindAnimalClickEvent();

      console.log(this.riverBankInfo);
      //  判断是否游戏结束
      if (this.ifGameOver(pos, 'arrive')) {
        this.gameOver(pos, 'arrive');
      } else {
        console.log('继续');
      }
    }, this));
    this.boat.runAction(se);

    const passages = boatIns.passages;
    // if (!boatIns.isEmpty()) {
    for (let i = 0; i < passages.length; i++) {
      if (passages[i]) {
        passages[i].sail({
          delX: boatIns.seats[passages[i].seatIndex][passageStr].x - passages[i].node.x,
          delY: boatIns.seats[passages[i].seatIndex][passageStr].y - passages[i].node.y,
        });
      }

    }
    // }
  },

  // 判定游戏是否结束
  //  pos表示判断哪一岸的情况
  //  state表示离岸还是靠岸
  ifGameOver(pos, state) {
    const boatInfo = this.boat.getComponent('Boat');
    // console.log(this.riverBankInfo, boatInfo);
    if (state === 'leave') { //  离开岸边，不用加上船上的动物数量
      if (this.riverBankInfo[pos].deerNum < 1) return false;  //  如果没有鹿，不可能游戏结束
      if (this.riverBankInfo[pos].tigerNum > this.riverBankInfo[pos].deerNum) return true;
    } else {
      if (this.riverBankInfo[pos].deerNum + boatInfo.boatInfo.deerNum < 1) return false;
      if (this.riverBankInfo[pos].tigerNum + boatInfo.boatInfo.tigerNum
        > this.riverBankInfo[pos].deerNum + boatInfo.boatInfo.deerNum) return true;
    }
    return false;
  },

  //  游戏结束时执行
  /**
   * 
   * @param {string} pos 左岸发生还是右岸发生，值为'left'或者'right'
   * @param {string} boatStatus 船的状态，可以为’arrive‘或者’leave‘
   */
  gameOver(pos, boatStatus) {
    const tigers = [];
    const deers = [];
    // console.log(pos, boatStatus);
    const addFlag = true;
    if (pos === 'left') {
      //  获取岸上的老虎对象
      this.tigers.forEach((tiger) => {
        if (tiger.getComponent('Animal').atLeft()) tigers.push(tiger);
      });
      //  获取岸上的鹿对象
      this.deers.forEach((deer) => {
        if (deer.getComponent('Animal').atLeft()) deers.push(deer);
      });
    } else {
      //  获取岸上的老虎对象
      this.tigers.forEach((tiger) => {
        if (!tiger.getComponent('Animal').atLeft() && !tiger.getComponent('Animal').onBoat) tigers.push(tiger);
      });
      //  获取岸上的鹿对象
      this.deers.forEach((deer) => {
        if (!deer.getComponent('Animal').atLeft() && !deer.getComponent('Animal').onBoat) deers.push(deer);
      });
    }

    if (boatStatus === 'arrive') {  //  到达左岸的情形
      // console.log('到达岸边');
      //  把船上的动物也加上
      // console.log(this.boat.getComponent('Boat').passages);
      this.boat.getComponent('Boat').passages.forEach((passage) => {
        if (passage) {
          if (passage.animalType === 'tiger') {
            tigers.push(passage.node);
          } else {
            deers.push(passage.node);
          }
        }
      });
    } 

    //  播放老虎吃鹿的动画
    console.log(tigers, deers);
    for (let i = 0; i < deers.length; i++) {
      // console.log(deers[i].x, tigers[i].x);
      const eatAction = tigers[i].getComponent('Animal').eatDeer({
        delX: deers[i].x - tigers[i].x,
        delY: deers[i].y - tigers[i].y,
      });
      const se = cc.sequence(eatAction, cc.callFunc(() => {
        // console.log('eating finished');
        deers[i].opacity = 0;
        if (i === 0) cc.director.loadScene('gameOver');
      }, this));

      tigers[i].runAction(se);
    }
    // cc.director.loadScene('gameOver');
  },

  //  判断是否胜利
  ifSucceeded() {
    //  如果右岸动物总数达到6，则胜利
    if (this.riverBankInfo.right.tigerNum + this.riverBankInfo.right.deerNum === 6) return true;
    return false;
  },

  //  胜利后执行的操作
  succeed() {
    cc.director.loadScene('succeed');
  },

  //  弹出提示
  showRules() {
    // const ruleOpacity = this.ruleContext.node.opacity;
    const opacity = this.ruleContext.node.opacity === 255 ? 0 : 255;
    cc.tween(this.ruleContext.node)
    .to(0.5, {opacity: opacity})
    .start();
  },

  //  点击游戏规则按钮的事件
  onRulesBtnClick() {
    this.showRules();
  },

  onRulesBtnHover() {
    cc.game.canvas.style.cursor = 'pointer';
  },

  onRulesBtnLeave() {
    cc.game.canvas.style.cursor = 'default';
  },

  //  绑定游戏规则按钮事件
  bindRulesBtnEvent() {
    this.rulesBtn.node.on(cc.Node.EventType.MOUSE_DOWN, this.onRulesBtnClick, this);
    this.rulesBtn.node.on(cc.Node.EventType.MOUSE_ENTER, this.onRulesBtnHover, this);
    this.rulesBtn.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onRulesBtnLeave, this);
  },

  onLoad() {
    this.initBackground();
    this.bindGoEvent();
    this.bindEnterAndLeave();
    this.bindRulesBtnEvent();
    this.ruleContext.node.opacity = 0;
    this.ruleContext.node.zindex = 99;
    // cc.game.addPersistRootNode(this.node);
    // console.log(this.tigers[0]);
    // console.log(this.tigers[0]);
    // this.tigers[0].getComponent('Animal').jump();
  },

  start() {

  },

  update(dt) {
    // console.log(this.tigers[0]);
    // this.tigers[0].getComponent('Animal').jump();
  },
});
