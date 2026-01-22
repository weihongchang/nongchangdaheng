import { _decorator, Component, Node, Button, Label, Sprite, SpriteFrame, loader, NodeEventType } from 'cc';
import { ClickFunctor } from '../../common/ClickFunctor';
import { HeroProp } from '../../common/HeroProp';
import { SysMgr } from '../../common/SysMgr';
import { DlgSys } from '../../sys/DlgSys';
import { InterruptDlg } from '../ui/InterruptDlg';
import { MainDlg } from '../ui/MainDlg';

const { ccclass, property } = _decorator;

@ccclass('InterruptDlgCom')
export class InterruptDlgCom extends InterruptDlg {
    data?: any;
    initDlg(data?: any) {
        super.initDlg(data);
        this.m_TipLabel.getComponent(Label).string = data;
    }
}