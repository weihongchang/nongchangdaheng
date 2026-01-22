import { _decorator, Component, Node, AudioClip } from 'cc';
import { SysBase } from '../base/SysBase';
import { WsCom } from '../common/com/WsCom';
import { DestroyCB } from '../common/DestroyCB';
import { EventDefine } from '../common/EventDefine';
import { EventProp } from '../common/EventProp';
import { SysMgr } from '../common/SysMgr';
import { BubbleTipDlgCom } from '../dlg/dlgcom/BubbleTipDlgCom';
import { LoginDlgCom } from '../dlg/dlgcom/LoginDlgCom';
import { DlgSys } from './DlgSys';
import { EventSys } from './EventSys';
const { ccclass, property } = _decorator;

@ccclass('WsSys')
export class WsSys extends SysBase {
    wsMap = new Map();

    onLoad() {
        var eventSys = SysMgr.getSys(EventSys)
        eventSys.watchEvent(EventDefine.WS_LOGIN_OUT, this, "net_LoginOut");
    }
    async net_LoginOut(login_out_data) {
        this.removeAllWs();
        SysMgr.getSys(DlgSys).closeAllDlg()
        await SysMgr.getSys(DlgSys).createDlg(LoginDlgCom);
        BubbleTipDlgCom.createTip("存在重复登录行为");
    }

    addWs(name, uid, url,) {
        var com = this.wsMap.get(name)
        if (com != null) {
            com.close()
        }


        com = new WsCom().init(name,uid, url)
        this.wsMap.set(name, com);
        return com;
    }

    getWs(name) {
        return this.wsMap.get(name);
    }

    removeWs(name) {
        var com = this.wsMap.get(name)
        if (com == null)
            return
        com.close()
        this.wsMap.delete(name)
    }
    removeAllWs() {
        for (var name of this.wsMap.keys()) {
            var com = this.wsMap.get(name)
            com.close()
        }
       
        this.wsMap.clear()
    }
}

