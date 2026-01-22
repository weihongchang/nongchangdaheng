import { _decorator, Component, Node } from 'cc';
import { ComBase } from '../base/ComBase';
import { SysBase } from '../base/SysBase';

import { LoginDlgCom } from '../dlg/dlgcom/LoginDlgCom';
import { MapDlgCom } from '../dlg/dlgcom/MapDlgCom';
import { AudioSys } from '../sys/AudioSys';
import { CommonSys } from '../sys/CommonSys';
import { DlgSys } from '../sys/DlgSys';
import { EventSys } from '../sys/EventSys';
import { HeroSys } from '../sys/HeroSys';

import { PoolSys } from '../sys/PoolSys';
import { TimeSys } from '../sys/TimeSys';
import { WsSys } from '../sys/WsSys';

import { PreLoad } from './PreLoad';
const { ccclass, property } = _decorator;

@ccclass('SysMgr')
export class SysMgr extends SysBase {
    public static ins: SysMgr;

    static getSys<T extends Component>(classConstructor: new () => T): T | null {
        return SysMgr.ins.getCom(classConstructor);
    }

    static addSys<T extends SysBase>(classConstructor: new () => T): T | null {
        return SysMgr.ins.addCom(classConstructor);
    }

    static removeSys<T extends SysBase>(classConstructor: new () => T): void {
        SysMgr.ins.removeCom(classConstructor);
    }


    async init() {
        SysMgr.addSys(TimeSys);
        SysMgr.addSys(EventSys);
        SysMgr.addSys(CommonSys);
        SysMgr.addSys(DlgSys);
        SysMgr.addSys(PoolSys);
        SysMgr.addSys(WsSys);
        SysMgr.addSys(HeroSys);
        SysMgr.addSys(AudioSys);
        return this;
    }

    async enter() {
        await this.enterMain();
    }

    async enterMain() {
        await PreLoad.preloadRes(); // 资源预加载
        await SysMgr.ins.getCom(DlgSys).createDlg(LoginDlgCom);
    }

    async enterGame(startData?: any) {

    }

    async exitGame() {

    }
}