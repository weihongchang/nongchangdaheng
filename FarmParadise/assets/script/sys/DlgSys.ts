import { _decorator, Component, Node } from 'cc';
import { ComBase } from '../base/ComBase';
import { DlgBase } from '../base/DlgBase';
import { SysBase } from '../base/SysBase';
import { DlgMgrCom } from '../dlg/mgrcom/DlgMgrCom';

const { ccclass, property } = _decorator;

@ccclass('DlgSys')
export class DlgSys extends SysBase {
    onLoad() {
        this.addCom(DlgMgrCom);
    }

    async createMulDlg(dlgConstructor: typeof DlgBase, data?: any): Promise<Node> {
        return this.getCom(DlgMgrCom).createMulDlg(dlgConstructor, data);
    }

    async createDlg(dlgConstructor: typeof DlgBase, data?: any): Promise<Node> {
        return this.getCom(DlgMgrCom).createDlg(dlgConstructor, data);
    }

    getDlg(dlgConstructor: typeof DlgBase): Node {
        return this.getCom(DlgMgrCom).getDlg(dlgConstructor);
    }

    closeDlg(dlgConstructor: typeof DlgBase): void {
        this.getCom(DlgMgrCom).closeDlg(dlgConstructor);
    }

    closeAllDlg(): void {
        this.getCom(DlgMgrCom).closeAllDlg();
    }

}