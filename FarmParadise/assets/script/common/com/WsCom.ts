import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, loader, assetManager, Texture2D, SpriteFrame, Sprite } from 'cc';
import { ComBase } from '../../base/ComBase';
import { EventSys } from '../../sys/EventSys';
import { TimeSys } from '../../sys/TimeSys';
import { EventDefine } from '../EventDefine';
import { ResourceLoader } from '../ResourceLoader';
import { ResourcesPathDefine } from '../ResourcesPathDefine';
import { SysMgr } from '../SysMgr';
import { WsProp } from './WsProp';


const { ccclass, property } = _decorator;

@ccclass('WsCom')
export class WsCom extends ComBase {
    ws: WebSocket;
    uid: string;
    wsProp: WsProp = new WsProp();
    isSucc = false;
    funcMap = new Map<string, Map<any, Array<string>>>();
    wsUrl: string
    wsName: string;
    data_arr = new Array();
    event_arr = new Array();
    init(wsName: string, uid: string, wsUrl: string) {
        this.wsName = wsName;
        this.uid = uid;
        this.wsUrl = wsUrl
        this.initWs()
        SysMgr.getSys(TimeSys).addTimer(this, "_heart", 5, true);
        SysMgr.getSys(TimeSys).addTimer(this, "_reConn", 3, true);
        //SysMgr.getSys(TimeSys).addTimer(this, "_runEvent", 0.01, true);
        return this;
    }

    initWs() {
        this.ws = new WebSocket(this.wsUrl);
        var self = this;
        this.ws.onopen = function (event) {
            console.log("连接成功！", event, this);
            self.initSucc();
        }

        this.ws.onmessage = async function (event) {
            var data = JSON.parse(event.data)
            await SysMgr.getSys(EventSys).runEvent(data.func, data);
           // self.event_arr.push(data)
        }

        this.ws.onclose = function onclose(event) {
            self.isSucc = false;
            console.log("关闭！", event);
        }
    }

    close() {
        SysMgr.getSys(TimeSys).removeTimer(this, "_heart");
        SysMgr.getSys(TimeSys).removeTimer(this, "_reConn");
        this.ws.close()
    }
    //async _runEvent() {
    //    console.log("BBBBBBBB", this.event_arr.length)
    //    for (let data of this.event_arr)
    //        await SysMgr.getSys(EventSys).runEvent(data.func, data);
    //    this.event_arr = []
    //}

    _reConn() {
        if (this.isSucc)
            return
        this.initWs()
    }

    _heart() {
        this.sendMsg("heart", {})
    }


    initSucc() {
        this.isSucc = true;
        this.sendMsg(this.wsName+"_init", {
            uid: this.uid
        })
    }

    sendMsg(api, data) {
        if (!this.isSucc)
            return;
        data.func = api
        //this.data_arr.push(data)
        this.ws.send(JSON.stringify(data));
    }


    
}

