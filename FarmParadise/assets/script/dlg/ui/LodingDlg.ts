
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('LodingDlg')
export class LodingDlg extends DlgBase {
    public static UI_PATH: string = "LodingDlg";
	public m_msg: Node;
	public m_ProgressBar: Node;

    initDlg(data?: any) {
		this.m_msg = this.node.getChildByName("m_msg");
		this.m_ProgressBar = this.node.getChildByName("m_ProgressBar");

    }
}
