import { _decorator, Component, Node, native, Label, input, TypeScript, CCClass, js, Input, EventKeyboard, screen, view, ResolutionPolicy, EventTouch, UITransform, Vec3, Camera } from 'cc';
import { PrintTool } from './tools/PrintTool';

import { GlobalVar } from './common/GlobalVar';

import { SysMgr } from './common/SysMgr';
import { ComBase } from './base/ComBase';




const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node)
    JoyStick: Node;
    @property(Camera)
    camera: Camera;

    isHeng = false;  

    Pole: Node;
    Dish: Node;

    async start() {
        
        this.initGlobalVar();
        this.initSys();

        view.on("canvas-resize", this.resize, this);
        this.scheduleOnce(this.resize);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

    }

    initGlobalVar() {
        GlobalVar.isTest = false;
        if (!window["wx"])
            GlobalVar.isWX = false;
        else {
            GlobalVar.isTest = false;
            GlobalVar.isWX = true;
        }
            
        GlobalVar.canvas = this.node;
        GlobalVar.gamePanel = new Node();
        GlobalVar.gamePanel.name = "gamePanel";
        GlobalVar.gamePanel.parent = this.node;
        GlobalVar.mainCamera = this.camera;

        GlobalVar.gameRoot = this.node.parent.getChildByName("Game");

        this.Pole = this.JoyStick.getChildByName("Pole");
        this.Dish = this.JoyStick.getChildByName("Dish");
        this.JoyStick.active = false;
    }

    async initSys() {
       

        var sysMgrObj = new Node();
        sysMgrObj.name = SysMgr.name;
        sysMgrObj.parent = this.node;

      
        //if (GlobalVar.isTest) {
        //    PrintTool.init();
        //    CodeReoladTool.init();
        //}
        SysMgr.ins = sysMgrObj.addComponent(SysMgr);
        await SysMgr.ins.init();

        await SysMgr.ins.enter();
    }



     resize(e?) {
        if (screen.windowSize.height > screen.windowSize.width && screen.windowSize.width / screen.windowSize.height < 1) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
            this.isHeng = false;
            //竖屏

        } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
            this.isHeng = true;
            //横屏

        }
        GlobalVar.CameraControl.cameraOnLoad();
    }


     onTouchStart(event?: EventTouch) {
        // if (this.isGameOver || GameGlobal.cameraMoving) return;
        
        // if (GameGlobal.GameState == GameState.end) {
        //     GameGlobal.cameraMoving = true;
        //     GameGlobal.mainGame.gameOver(true)
        //     return;
        // }
        // if (GameGlobal.GameState == GameState.ready) {
        //     GameGlobal.GameState = GameState.run;
        // }
        this.JoyStick.active = true;
        let pos_touch = event.getUILocation();    // 触摸点坐标@UI世界坐标系
        let uiTransform = this.node.getComponent(UITransform);
        let pos_nodeSpace = uiTransform.convertToNodeSpaceAR(new Vec3(pos_touch.x, pos_touch.y, 0));
        this.JoyStick.setPosition(pos_nodeSpace);
        // this.tiShiShouNode.active = false;
        // this.tiShiTimer = 0;
        // this.isTiShi = false;
    }


    onTouchMove(event?: EventTouch) {
        // if (this.isGameOver || GameGlobal.cameraMoving) return;
        this.JoyStick.active = true;
        let pos_touch = event.getUILocation();    // 触摸点坐标@UI世界坐标系
        let uiTransform = this.JoyStick.getComponent(UITransform);
        let pos_nodeSpace = uiTransform.convertToNodeSpaceAR(new Vec3(pos_touch.x, pos_touch.y, 0));
        // 判断极限位置
        let len = pos_nodeSpace.length();   // 自身坐标系的坐标
        let uiTransform2 = this.Dish.getComponent(UITransform);  // 活动范围
        let maxLen = uiTransform2.width * 0.3;
        let ratio = len / maxLen;
        if (ratio > 1) {
            pos_nodeSpace.divide(new Vec3(ratio, ratio, 1));
        }
        this.Pole.setPosition(pos_nodeSpace);
        
        GlobalVar.player.move(pos_nodeSpace.normalize());


        // this.tiShiShouNode.active = false;
        // this.tiShiTimer = 0;
        // this.isTiShi = false;
    }


    onTouchEnd(event?: EventTouch) {
        // if (this.isGameOver || GameGlobal.cameraMoving) return;
        GlobalVar.player.stopMove();
        this.Pole.setPosition(Vec3.ZERO);
        this.JoyStick.active = false;
        // this.tiShiShouNode.active = false;
        // this.tiShiTimer = 0;
        // this.isTiShi = true;
    }


    onTouchCancel(event?: EventTouch) {
        // if (this.isGameOver || GameGlobal.cameraMoving) return;
        GlobalVar.player.stopMove();
        this.Pole.setPosition(Vec3.ZERO);
        this.JoyStick.active = false;
        // this.tiShiShouNode.active = false;
        // this.tiShiTimer = 0;
        // this.isTiShi = true;
    }

}
