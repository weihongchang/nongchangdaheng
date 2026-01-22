import { _decorator, Component, Node, Animation, __private, Vec3, ProgressBar, tween } from 'cc';
import { ComBase } from '../base/ComBase';
import { ResourceLoader } from '../common/ResourceLoader';
import { Functor } from './Functor';


const { ccclass, property } = _decorator;

@ccclass('DestroyCB')
export class DestroyCB extends Component {
    static cbObjSet = "_cbObjSet";
    static onDestroyName = "onDestroy";
    static onDestroyReplaceName = "_onDestroyReplace";
    static addCb(watchDestroyObj: any, cbObj: any, funcName: string) {
        //添加自动移除需要的数据
        if (watchDestroyObj[DestroyCB.cbObjSet] == null) {
            watchDestroyObj[DestroyCB.cbObjSet] = new Set<any>();
            
        }
       

        if (!watchDestroyObj[DestroyCB.cbObjSet].has(cbObj)) {
            watchDestroyObj[DestroyCB.cbObjSet].add(cbObj);
            if (watchDestroyObj.onDestroy != null && watchDestroyObj._onDestroyReplace == null) {//自定义onDestroy 替换onDestroy同时记录旧onDestroy
                watchDestroyObj._onDestroyReplace = []
                watchDestroyObj._onDestroyReplace.push(watchDestroyObj.onDestroy.bind(cbObj));
                watchDestroyObj[DestroyCB.onDestroyName] = Functor.getNotWatchDestroyFunc(this, "onDestroyFunc", watchDestroyObj, cbObj, funcName);
            } else if (watchDestroyObj._onDestroyReplace == null) {//第一次替换 但是没有自定义onDestroy 直接替换了onDestroy
                watchDestroyObj._onDestroyReplace = []
                watchDestroyObj[DestroyCB.onDestroyName] = Functor.getNotWatchDestroyFunc(this, "onDestroyFunc", watchDestroyObj, cbObj, funcName);
                //watchDestroyObj._onDestroyReplace.push(Functor.getFunc(cbObj, funcName, watchDestroyObj));
            } else {
                watchDestroyObj._onDestroyReplace.push(Functor.getNotWatchDestroyFunc(cbObj, funcName, watchDestroyObj));
            }

           
        }
    }
    static onDestroyFunc(watchDestroyObj: any, cbObj: any, funcName: string) {
        Functor.getNotWatchDestroyFunc(cbObj, funcName, watchDestroyObj)();
        if (watchDestroyObj._onDestroyReplace != null) {
            for (var func of watchDestroyObj._onDestroyReplace)
                func()
        }
    
    }
   
}

