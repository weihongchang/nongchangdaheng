import { _decorator, Component, Node, Button, Label, Sprite, SpriteFrame, loader, NodeEventType, Texture2D, RenderTexture, assetManager, ImageAsset, EditBox, ProgressBar } from 'cc';
import { ClickFunctor } from '../../common/ClickFunctor';
import { GlobalVar } from '../../common/GlobalVar';
import { IntervalMgr } from '../../common/IntervalMgr';
import { SysMgr } from '../../common/SysMgr';
import { DlgSys } from '../../sys/DlgSys';
import { HttpUtils } from '../../utils/HttpUtils';
import { StorageUtils } from '../../utils/StorageUtils';
import { LoginDlg } from '../ui/LoginDlg';
import { BubbleTipDlgCom } from './BubbleTipDlgCom';
import { InterruptDlgCom } from './InterruptDlgCom';
import { MainDlgCom } from './MainDlgCom';
import { LodingDlgCom } from './LodingDlgCom';
import { LodingDlg } from '../ui/LodingDlg';
const { ccclass, property } = _decorator;

@ccclass('LoginDlgCom')
export class LoginDlgCom extends LoginDlg {
    data?: any;

    async initDlg(data?: any) {
        super.initDlg(data);
        this.initEvent()
        this.m_AccEditBox.getComponent(EditBox).string = StorageUtils.getData("acc","");
        this.m_PwdEditBox.getComponent(EditBox).string = StorageUtils.getData("pwd", "");
    }
    initEvent() {
        this.m_StartBtn.on("click", ClickFunctor.getFunc(this, "onStartClick"), this);
        this.m_StartBtn1.on("click", ClickFunctor.getFunc(this, "fastStart", this.m_StartBtn1), this);
        this.m_StartBtn2.on("click", ClickFunctor.getFunc(this, "fastStart", this.m_StartBtn2), this);
        this.m_StartBtn3.on("click", ClickFunctor.getFunc(this, "fastStart", this.m_StartBtn3), this);
        this.m_StartBtn4.on("click", ClickFunctor.getFunc(this, "fastStart", this.m_StartBtn4), this);
        this.m_StartBtn5.on("click", ClickFunctor.getFunc(this, "fastStart", this.m_StartBtn5), this);

    }


    @IntervalMgr.Lock()
    fastStart(oBtn) {
        this.m_AccEditBox.getComponent(EditBox).string = oBtn.getChildByName("Label").getComponent(Label).string
        this.m_PwdEditBox.getComponent(EditBox).string = oBtn.getChildByName("Label").getComponent(Label).string
         
        this.onStartClick();
    }

    isLoadingComplete = false;
    protected update(dt: number): void {
        
        if( this.isLoadingComplete )
        {
            this.closeDlg(LoginDlgCom)
        }
    }

    @IntervalMgr.Lock()
    async onStartClick() {
        var acc = this.m_AccEditBox.getComponent(EditBox).string
        var pwd = this.m_PwdEditBox.getComponent(EditBox).string
        StorageUtils.saveData("acc", acc)
        StorageUtils.saveData("pwd", pwd)
        // var result = await HttpUtils.post(GlobalVar.httpUrl+"/api/relam0/login", JSON.stringify({
        //     acc: acc,
        //     pwd: pwd
        // }))

        // var obj = JSON.parse(result)
     
        // if (obj.success == true) {
        let obj = await SysMgr.getSys(DlgSys).createDlg(LodingDlgCom,'')
        
        if( obj )
        {
            let maindlg = await SysMgr.getSys(DlgSys).createDlg(MainDlgCom, '')// obj.data)
            if( maindlg )
            {
                obj.setSiblingIndex(maindlg.getSiblingIndex()+1)
                // console.log(maindlg.getComponent(MainDlgCom).isLoadingComplete);
                // while(maindlg.getComponent(MainDlgCom).isLoadingComplete)
                // {
                    
                //     console.log(maindlg.getComponent(MainDlgCom).isLoadingComplete);
                //     obj.getComponent(LodingDlgCom).m_ProgressBar.getComponent(ProgressBar).progress =1
                // }
            }
        }
            // await SysMgr.getSys(DlgSys).createDlg(MainDlgCom, '')// obj.data)
            // BubbleTipDlgCom.createTip("登录成功")
            
        // }
        // else 
        // {
        //     BubbleTipDlgCom.createTip(obj.msg)
        // }
        
        
    }
  
}