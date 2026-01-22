import { _decorator, Component, Node, __private, Vec3, Vec2, Widget, Enum } from 'cc';
import { ComBase } from '../../base/ComBase';
import { DlgBase } from '../../base/DlgBase';
import { GlobalVar } from '../../common/GlobalVar';
import { ResourceLoader } from '../../common/ResourceLoader';
import { ResourcesPathDefine } from '../../common/ResourcesPathDefine';

const { ccclass, property } = _decorator;

@ccclass('DlgMgrCom')
export class DlgMgrCom extends ComBase {
    
    dlgMap = new Map<string, Node>();
    root: Node;
    onLoad() {
        //this.root = new Node();
        //this.root.parent = GlobalVar.canvas;
        this.root = GlobalVar.canvas.getChildByName("uiRoot");
        this.root.setSiblingIndex(99999);
        //this.root.name = "uiRoot";
        //this.root.setWorldPosition(0, 0, 0);
    }

    async createMulDlg(dlgConstructor: typeof DlgBase, data?: any): Promise<Node> {
        var obj = await ResourceLoader.insNode(ResourcesPathDefine.UI_ROOT_PATH + "/" + dlgConstructor.UI_PATH)
        obj.addComponent(dlgConstructor).initDlg(data);
        obj.parent = this.root;
        return obj;
    }

    async createDlg(dlgConstructor: typeof DlgBase, data?: any): Promise<Node> {
        if (this.dlgMap.has(dlgConstructor.UI_PATH))
            return this.dlgMap.get(dlgConstructor.UI_PATH);
        var obj = await ResourceLoader.insNode(ResourcesPathDefine.UI_ROOT_PATH + "/" + dlgConstructor.UI_PATH)
        this.dlgMap.set(dlgConstructor.UI_PATH, obj);
        obj.addComponent(dlgConstructor).initDlg(data);
        obj.parent = this.root;
        return obj;
    }

    getDlg(dlgConstructor: typeof DlgBase): Node {
        return this.dlgMap.get(dlgConstructor.UI_PATH);
    }

    closeDlg(dlgConstructor: typeof DlgBase): void {
        if (!this.dlgMap.has(dlgConstructor.UI_PATH))
            return;
        var oDlg = this.dlgMap.get(dlgConstructor.UI_PATH);
        this.dlgMap.delete(dlgConstructor.UI_PATH);
        oDlg.destroy();
    }

    closeAllDlg(): void {
        for (var key of this.dlgMap.keys()) {
            var oDlg = this.dlgMap.get(key);
            oDlg.destroy();
        }
        this.dlgMap.clear()
    }

}