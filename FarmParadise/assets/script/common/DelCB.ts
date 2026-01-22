import { _decorator, Component, Node, Animation, __private, Vec3, ProgressBar, tween } from 'cc';
import { ComBase } from '../base/ComBase';
import { ResourceLoader } from '../common/ResourceLoader';
import { Functor } from './Functor';


const { ccclass, property } = _decorator;

@ccclass('DelCB')
export class DelCB extends Component {
    static cbObjSet = "_cbObjSet";
    static onDestroyName = "onDestroy";
    static onDestroyReplaceName = "_onDestroyReplace";
    static addCb(watchDestroyObj: any, cbObj: any, funcName: string) {
        //添加自动移除需要的数据
        if (watchDestroyObj[DelCB.cbObjSet] == null) {
            watchDestroyObj[DelCB.cbObjSet] = new Set<any>();
        }

        if (!watchDestroyObj[DelCB.cbObjSet].has(cbObj)) {
            watchDestroyObj[DelCB.cbObjSet].add(cbObj);
            if (watchDestroyObj[DelCB.onDestroyName] != null) {
                watchDestroyObj._onDestroyReplace = watchDestroyObj.onDestroy.bind(cbObj)
            }
               
            watchDestroyObj[DelCB.onDestroyName] = Functor.getFunc(this, "onDestroyFunc", watchDestroyObj, cbObj, funcName);
        }

    }
    static onDestroyFunc(watchDestroyObj: any, cbObj: any, funcName: string) {
        //this.addCb.prototype()
        Functor.getFunc(cbObj, funcName, watchDestroyObj)();
        var onDestroyFunc = watchDestroyObj[DelCB.onDestroyReplaceName];
        console.log("BBBBBBBBB", onDestroyFunc)
        if (watchDestroyObj._onDestroyReplace != null) {
            console.log("AAAAAAAAAAAAAA")
            watchDestroyObj._onDestroyReplace()
        }

        //console.log("AAAAAAAA=" + onDestroyFunc.prototype)
        //if (onDestroyFunc != null) {
        //    onDestroyFunc();
        //}
    }


}

