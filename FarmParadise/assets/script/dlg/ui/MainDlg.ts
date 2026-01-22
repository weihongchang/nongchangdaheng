
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('MainDlg')
export class MainDlg extends DlgBase {
    public static UI_PATH: string = "MainDlg";
	public m_NameLabel: Node;
	public m_Content: Node;
	public m_ScrollView: Node;
	public m_NumLabel: Node;
	public m_SendBtn: Node;
	public m_SendEditBox: Node;
	public m_MapContent0: Node;
	public m_EnterBtn0: Node;
	public m_EnterBtn1: Node;
	public m_MapContent1: Node;

	public m_funBtn1: Node;
	public m_funBtn2: Node;
	public m_funBtn3: Node;
	public m_funBtn4: Node;
	public m_funBtn5: Node;

	public m_moneyNum: Node;

    initDlg(data?: any) {
		this.m_NameLabel = this.node.getChildByName("m_NameLabel");
		this.m_Content = this.node.getChildByName("Node").getChildByName("m_ScrollView").getChildByName("view").getChildByName("m_Content");
		this.m_ScrollView = this.node.getChildByName("Node").getChildByName("m_ScrollView");
		this.m_NumLabel = this.node.getChildByName("Node").getChildByName("m_NumLabel");
		this.m_SendBtn = this.node.getChildByName("Node").getChildByName("m_SendBtn");
		this.m_SendEditBox = this.node.getChildByName("Node").getChildByName("m_SendEditBox");
		this.m_MapContent0 = this.node.getChildByName("ScrollView").getChildByName("view").getChildByName("m_MapContent0");
		this.m_EnterBtn0 = this.node.getChildByName("m_EnterBtn0");
		this.m_EnterBtn1 = this.node.getChildByName("m_EnterBtn1");
		this.m_MapContent1 = this.node.getChildByName("ScrollView-001").getChildByName("view").getChildByName("m_MapContent1");
		this.m_funBtn1 = this.node.getChildByName("di").getChildByName("m_fun1");
		this.m_funBtn2 = this.node.getChildByName("di").getChildByName("m_fun2");
		this.m_funBtn3 = this.node.getChildByName("di").getChildByName("m_fun3");
		this.m_funBtn4 = this.node.getChildByName("di").getChildByName("m_fun4");
		this.m_funBtn5 = this.node.getChildByName("di").getChildByName("m_fun5");
		this.m_moneyNum = this.node.getChildByName("top").getChildByName("money").getChildByName("m_moneyNum");

    }
}
