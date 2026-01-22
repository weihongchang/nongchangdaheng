
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('InterruptDlg')
export class InterruptDlg extends DlgBase {
    public static UI_PATH: string = "InterruptDlg";
	public m_TipLabel: Node;

    initDlg(data?: any) {
		this.m_TipLabel = this.node.getChildByName("m_TipLabel");

    }
}
