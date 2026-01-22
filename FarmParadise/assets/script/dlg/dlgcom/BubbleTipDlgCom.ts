import { _decorator, Component, Node, Button, Label, tween, Vec3, Color, Sprite } from 'cc';
import { Functor } from '../../common/Functor';
import { SysMgr } from '../../common/SysMgr';
import { DlgSys } from '../../sys/DlgSys';
import { BubbleTipDlg } from '../ui/BubbleTipDlg';
const { ccclass, property } = _decorator;

@ccclass('BubbleTipDlgCom')
export class BubbleTipDlgCom extends BubbleTipDlg {
    static msgArr: Array<string> = new Array<string>();
    static async createTip(msg: string) {
        await SysMgr.ins.getCom(DlgSys).createMulDlg(BubbleTipDlgCom, msg);
    }

    static showTip() {
        if (BubbleTipDlgCom.msgArr.length <= 0)
            return;
        var msg =BubbleTipDlgCom.msgArr.shift();
        SysMgr.ins.getCom(DlgSys).createMulDlg(BubbleTipDlgCom, msg);
    }



    data?: any;
    nowPos: Vec3;
    moveUp = 30;

    stopTime = 0.5;
    moveTime = 0.35;
    colorChangeTime = 0.3;
    initDlg(data?: any) {
        super.initDlg(data);
        this.m_TipLabel.getComponent(Label).string = data;
       
        var tipLabel = this.m_TipLabel.getComponent(Label);
        var newColor = new Color(tipLabel.color);
        tween(newColor).delay(this.moveTime + this.stopTime).to(this.colorChangeTime, {
            a: 0
        },{
                onUpdate: () => {
                    tipLabel.color = newColor;
                }

            }).start();

        var bgSprite = this.m_BgSprite.getComponent(Sprite);
        newColor = new Color(bgSprite.color);
        tween(newColor).delay(this.moveTime + this.stopTime).to(this.colorChangeTime, {
            a: 0
        },{
                onUpdate: () => {
                bgSprite.color = newColor;
                }

            }).start();

        this.nowPos = this.node.getPosition();
        var midPos = new Vec3(this.nowPos.x, this.nowPos.y + this.moveUp, this.nowPos.z);
        var targetPos = new Vec3(this.nowPos.x, this.nowPos.y + this.moveUp * 2, this.nowPos.z);

        tween(this.node).to(this.moveTime, {
            position: midPos,
        }).delay(this.stopTime).to(this.moveTime, {
            position: targetPos,
        }).call(Functor.getFunc(this,"removeDlg")).start();
    }

    removeDlg() {
        this.node.destroy();
        BubbleTipDlgCom.showTip();
    }
 
}