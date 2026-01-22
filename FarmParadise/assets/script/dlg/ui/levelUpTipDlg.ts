
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('levelUpTipDlg')
export class levelUpTipDlg extends DlgBase {
    public static UI_PATH: string = "levelUpTipDlg";
	public m_Mask: Node;
	public m_needMoney: Node;
	public m_icon: Node;
	public m_level: Node;
	public m_ProgressBar: Node;
	public m_titleIcon: Node;

    initDlg(data?: any) {
		this.m_Mask = this.node.getChildByName("m_Mask");
		this.m_needMoney = this.node.getChildByName("Button").getChildByName("ditie_jindu2").getChildByName("m_needMoney");
		this.m_icon = this.node.getChildByName("Button").getChildByName("m_icon");
		this.m_level = this.node.getChildByName("Button").getChildByName("m_level");
		this.m_ProgressBar = this.node.getChildByName("Button").getChildByName("m_ProgressBar");
		this.m_titleIcon = this.node.getChildByName("Button").getChildByName("m_titleIcon");

    }
}
