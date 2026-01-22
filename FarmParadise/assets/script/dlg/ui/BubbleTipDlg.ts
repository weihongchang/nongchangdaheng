
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('BubbleTipDlg')
export class BubbleTipDlg extends DlgBase {
    public static UI_PATH: string = "BubbleTipDlg";
	public m_BgSprite: Node;
	public m_TipLabel: Node;
	public m_MoveNode: Node;

    initDlg(data?: any) {
		this.m_BgSprite = this.node.getChildByName("m_MoveNode").getChildByName("m_BgSprite");
		this.m_TipLabel = this.node.getChildByName("m_MoveNode").getChildByName("m_TipLabel");
		this.m_MoveNode = this.node.getChildByName("m_MoveNode");

    }
}
