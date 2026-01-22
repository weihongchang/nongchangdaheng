import { _decorator, Component, Node, Animation, __private, Vec3, ProgressBar, tween, Label } from 'cc';
import { ComBase } from '../base/ComBase';
import { ResourcesObjBase } from '../base/ResourcesObjBase';
import { SysBase } from '../base/SysBase';
import { Defines } from '../common/Defines';
import { DestroyCB } from '../common/DestroyCB';
import { Functor } from '../common/Functor';
import { GlobalVar } from '../common/GlobalVar';
import { ResourceLoader } from '../common/ResourceLoader';
import { ResourcesPathDefine } from '../common/ResourcesPathDefine';
import { SysMgr } from '../common/SysMgr';


const { ccclass, property } = _decorator;

@ccclass('PoolSys')
export class PoolSys extends SysBase {
    objPool = new Map < string, Set<Node>>();
    static objPath = "_obj_path";
    poolNode: Node;
    public onLoad() {
        this.poolNode = new Node();
        this.poolNode.name = "poolNode";
        this.poolNode.active = false;
        //this.poolNode.parent = GlobalVar.canvas;
    }

    public async createNode(path): Promise<Node> {
        if (!this.objPool.has(path)) {
            this.objPool.set(path, new Set<Node>());
        }
        var objSet = this.objPool.get(path);
        if (objSet.size > 0) {
            for (var obj of objSet) {
                obj.active = true;
                objSet.delete(obj);
                return obj;
            }
        }
        var obj = await ResourceLoader.insNode(path);
        obj[PoolSys.objPath] = path;
        var com = obj.getComponent(ResourcesObjBase);
        DestroyCB.addCb(com, this, "_destroyNode")
        return obj;
    }

    public destroyNode(obj: Node) {
        obj.active = false;
        obj.parent = this.poolNode;
        var path = obj[PoolSys.objPath];
        if (!this.objPool.has(path)) {
            this.objPool.set(path, new Set<Node>());
        }
        var objSet = this.objPool.get(path);
        objSet.add(obj);
    }

    public _destroyNode(watchDestroyObj: ResourcesObjBase) {
        var obj = watchDestroyObj.node;
        var path = obj[PoolSys.objPath];
        if (!this.objPool.has(path)) {
            return;
        }
        this.objPool.get(path).delete(obj);
    }
}

