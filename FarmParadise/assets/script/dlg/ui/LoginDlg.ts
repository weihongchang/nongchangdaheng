
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('LoginDlg')
export class LoginDlg extends DlgBase {
    public static UI_PATH: string = "LoginDlg";
	public m_StartBtn: Node;
	public m_AccEditBox: Node;
	public m_PwdEditBox: Node;
	public m_StartBtn1: Node;
	public m_StartBtn2: Node;
	public m_StartBtn3: Node;
	public m_StartBtn4: Node;
	public m_StartBtn5: Node;

    initDlg(data?: any) {
		this.m_StartBtn = this.node.getChildByName("m_StartBtn");
		this.m_AccEditBox = this.node.getChildByName("Node").getChildByName("m_AccEditBox");
		this.m_PwdEditBox = this.node.getChildByName("Node-001").getChildByName("m_PwdEditBox");
		this.m_StartBtn1 = this.node.getChildByName("m_StartBtn1");
		this.m_StartBtn2 = this.node.getChildByName("m_StartBtn2");
		this.m_StartBtn3 = this.node.getChildByName("m_StartBtn3");
		this.m_StartBtn4 = this.node.getChildByName("m_StartBtn4");
		this.m_StartBtn5 = this.node.getChildByName("m_StartBtn5");

    }
}
