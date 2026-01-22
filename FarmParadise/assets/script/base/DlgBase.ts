import { _decorator, Component, Node, js, CCClass } from 'cc';
import { SysMgr } from '../common/SysMgr';
import { DlgSys } from '../sys/DlgSys';
import { ComBase } from './ComBase';
const { ccclass, property } = _decorator;

@ccclass('DlgBase')
export class DlgBase extends ComBase {
    public static UI_PATH: string = "";
    constructor() {
        super();
    }
    initDlg(data:any) {

    }
    closeDlg(dlgConstructor: typeof DlgBase) {
        SysMgr.ins.getCom(DlgSys).closeDlg(dlgConstructor);
    }

}