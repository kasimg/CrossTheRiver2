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

  //  点击GO之后的事件
  onGoBtnClicked() {
    // console.log('点击了一次');
    //  根据船的位置确定往哪里走，实际操作中有可能出现误差，所以这里给出一定的余地
    if (Math.abs(this.boat.x - Data.boatPositionLeft.x) < 10) {  //  如果在左边
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
  removeAnimalClickEvent() {
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

  //  点击按钮移动船
  sailTo(pos) {
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
    const se = cc.sequence(boatSailAction, cc.callFunc(() => {
      // console.log('动作执行完毕');
      //  动作执行完之后，重新绑定事件
      this.bindGoEvent();
      this.bindAnimalClickEvent();

      //  判断是否游戏结束
      // if(this.ifGameOver(pos)) {
      //   this.gameOver();
      // } else {
      //   console.log('继续');
      // }
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
  ifGameOver(pos) {
    const boatInfo = this.boat.getComponent('Boat');
    console.log(this.riverBankInfo, boatInfo);
    if (this.riverBankInfo[pos].tigerNum + boatInfo.boatInfo.tigerNum
      > this.riverBankInfo[pos].deerNum + boatInfo.boatInfo.deerNum) return true;
    return false;
  },

  //  游戏结束时执行
  gameOver() {
    console.log('game over');
  },

  onLoad() {
    this.initBackground();
    this.bindGoEvent();
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
