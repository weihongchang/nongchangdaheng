import { _decorator, Component, Node, AudioClip } from 'cc';
import { SysBase } from '../base/SysBase';
import { DestroyCB } from '../common/DestroyCB';
import { EventDefine } from '../common/EventDefine';
import { EventProp } from '../common/EventProp';
const { ccclass, property } = _decorator;

@ccclass('EventSys')
export class EventSys extends SysBase {
    eventProp: EventProp;

    onLoad() {
        this.eventProp = new EventProp();
    }

    watchEvent(event: string, obj: any, funcName: string) {
        this.eventProp.watch(event, obj, funcName);
    }

    async runEvent(event: string, args?: any) {
        var obj = new Object();
        obj[event] = this.eventProp[event] + 1;
        await this.eventProp.setData(obj, args);
    }
  
}

