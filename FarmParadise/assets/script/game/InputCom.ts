import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, loader, assetManager, Texture2D, tween, Vec3, Vec2, TweenAction, Tween, misc } from 'cc';
import { ComBase } from '../base/ComBase';
import { EventDefine } from '../common/EventDefine';
import { Functor } from '../common/Functor';
import { SysMgr } from '../common/SysMgr';
import { EventSys } from '../sys/EventSys';
import { PredictCom } from './PredictCom';


const { ccclass, property } = _decorator;




@ccclass('InputCom')
export class InputCom extends ComBase {
    dir = new Vec2(0, 0);
    init() {
        var eventSys = SysMgr.getSys(EventSys)
        eventSys.watchEvent(EventDefine.KEY_EVENT_DOWN, this, "onKeyDown");
        eventSys.watchEvent(EventDefine.KEY_EVENT_UP, this, "onKeyUp");
    }
    onKeyDown(event: EventKeyboard) {
        var x = this.dir.x;
        var y = this.dir.y;
        if (event.keyCode == KeyCode.KEY_A) {
            x -= 1;
        }
        if (event.keyCode == KeyCode.KEY_D) {
            x += 1;
        }
        if (x > 1) {
            x = 1;
        }
        if (x < -1) {
            x = -1;
        }

        if (event.keyCode == KeyCode.KEY_W) {
            y += 1;
        }
        if (event.keyCode == KeyCode.KEY_S) {
            y -= 1;
        }
        if (y > 1) {
            y = 1;
        }
        if (y < -1) {
            y = -1;
        }

        this.dir.x = x;
        this.dir.y = y;
    }

    onKeyUp(event: EventKeyboard) {
        var x = this.dir.x;
        var y = this.dir.y;
        if (event.keyCode == KeyCode.KEY_A) {
            x += 1;
        }
        if (event.keyCode == KeyCode.KEY_D) {
            x -= 1;
        }

        if (x > 1) {
            x = 1;
        }
        if (x < -1) {
            x = -1;
        }

        if (event.keyCode == KeyCode.KEY_W) {
            y -= 1;
        }
        if (event.keyCode == KeyCode.KEY_S) {
            y += 1;
        }

        if (y > 1) {
            y = 1;
        }
        if (y < -1) {
            y = -1;
        }

        this.dir.x = x;
        this.dir.y = y;
    }


}

