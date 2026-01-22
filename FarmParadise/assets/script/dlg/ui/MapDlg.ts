
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('MapDlg')
export class MapDlg extends DlgBase {
    public static UI_PATH: string = "MapDlg";
	public m_NameLabel: Node;
	public m_ExitButton: Node;
	public m_RoomLabel: Node;

    initDlg(data?: any) {
		this.m_NameLabel = this.node.getChildByName("m_NameLabel");
		this.m_ExitButton = this.node.getChildByName("m_ExitButton");
		this.m_RoomLabel = this.node.getChildByName("m_RoomLabel");

    }
}
