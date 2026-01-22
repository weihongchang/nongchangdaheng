import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, game, loader, assetManager, Texture2D } from 'cc';
import { ComBase } from '../../base/ComBase';
import { DlgSys } from '../../sys/DlgSys';
import { EventSys } from '../../sys/EventSys';

import { TimeSys } from '../../sys/TimeSys';
import { CodeReoladTool } from '../../tools/CodeReoladTool';

import { Defines } from '../Defines';
import { EventDefine } from '../EventDefine';
import { GlobalVar } from '../GlobalVar';
import { ResourceLoader } from '../ResourceLoader';
import { ResourcesPathDefine } from '../ResourcesPathDefine';
import { SysMgr } from '../SysMgr';

const { ccclass, property } = _decorator;

@ccclass('KeyCom')
export class KeyCom extends ComBase {
    eventSys: EventSys;
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.eventSys = SysMgr.getSys(EventSys)
    }
 
       

    onKeyDown(event: EventKeyboard) {
        this.eventSys.runEvent(EventDefine.KEY_EVENT_DOWN + event.keyCode.toString(), event)
        this.eventSys.runEvent(EventDefine.KEY_EVENT_DOWN, event)
    }

    onKeyUp(event: EventKeyboard) {
        this.eventSys.runEvent(EventDefine.KEY_EVENT_UP + event.keyCode.toString(), event)
        this.eventSys.runEvent(EventDefine.KEY_EVENT_UP, event)
    }

  
}

