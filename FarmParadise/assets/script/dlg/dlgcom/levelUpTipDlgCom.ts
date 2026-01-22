
import { _decorator, Label, ProgressBar, Sprite } from 'cc';
import { levelUpTipDlg } from '../ui/levelUpTipDlg';
import { SysMgr } from '../../common/SysMgr';
import { DlgSys } from '../../sys/DlgSys';
import { DataManager } from '../../game/DataManager';
import { ClickFunctor } from '../../common/ClickFunctor';
import { IntervalMgr } from '../../common/IntervalMgr';
import { BubbleTipDlgCom } from './BubbleTipDlgCom';

import { EventSys } from '../../sys/EventSys';
import { BuildDataImp } from '../../game/Data/BuildDataImp';
import { GlobalVar } from '../../common/GlobalVar';

const { ccclass, property } = _decorator;

@ccclass('levelUpTipDlgCom')
export class levelUpTipDlgCom extends levelUpTipDlg {
     
    static async createTip(msg: Number) {
        await SysMgr.ins.getCom(DlgSys).createMulDlg(levelUpTipDlgCom, msg);
    }

    buildID = 0;
    buildData: BuildDataImp;
    async initDlg(data?: any) {
        super.initDlg(data);
        this.buildID = Number.parseInt( data )
        if( this.buildID <= 0)
        {
            return ;
        }
        let lineID = 0;
        
        this.buildData = DataManager.getBuildData(this.buildID,lineID,GlobalVar.mapId);
        if( this.buildData == null )
            return;

        var eventSys = SysMgr.getSys(EventSys)
        eventSys.watchEvent('closeLevelUpTipDlg', this, "onClose");

        this.m_level.getComponent(Label).string = this.buildData.level.toString();
        this.m_needMoney.getComponent(Label).string = this.buildData.needMoney.toString()+"K";
        // this.m_titleIcon.getComponent(Sprite).spriteFrame = data.titleIcon;
        // this.m_icon.getComponent(Sprite).spriteFrame = data.icon;
        this.m_ProgressBar.getComponent(ProgressBar).progress = this.buildData.press;

        //事件
        this.m_Mask.on("click", ClickFunctor.getFunc(this, "onClose"), this);

        this.m_icon.parent.on("click", ClickFunctor.getFunc(this, "upgread"), this);
        
        

    }

	async refreshDlg() {

    }

    @IntervalMgr.Lock()
    async onClose() {
        this.node.destroy();

    }

    protected onDestroy(): void {
        
    }


     @IntervalMgr.Lock()
    async upgread() {
        // this.closeDlg(levelUpTipDlg);
        this.m_ProgressBar.getComponent(ProgressBar).progress +=.02; 
        this.m_needMoney.getComponent(Label).string = this.buildData.needMoney + 10 +"K";
        BubbleTipDlgCom.createTip("升级成功")
        if( this.buildID ==0 )
        {
            //招募工人
            this.buildData.prefabPath
        }


    }
}
