import { _decorator, Component, Node, __private } from 'cc';
import { PropBase } from '../base/PropBase';
import { DelCB } from './DelCB';
import { DestroyCB } from './DestroyCB';
const { ccclass, property } = _decorator;

@ccclass('EventProp')
export class EventProp{

    funcMap = new Map<string, Map<any, Array<string>>>();
    static propName = "_myProp";
    watch(key: string, obj: any, funcName: string) {
        if (!this.funcMap.has(key)) {
            this.funcMap.set(key, new Map<any, Array<string>>());
        }
        var map = this.funcMap.get(key);
        if (!map.has(obj)) {
            map.set(obj, new Array<string>());
        }
        var arr = map.get(obj);
        arr.push(funcName);

        //添加自动移除需要的数据
        if (obj[PropBase.propName] == null) {
            obj[PropBase.propName] = new Set<PropBase>();
        }
        obj[PropBase.propName].add(this);
        DestroyCB.addCb(obj, this, "onObjDestroy");
    }

    onObjDestroy(watchDestroyObj: any) {
        var propSet = watchDestroyObj[PropBase.propName];
        
        for (var prop of propSet) {
            prop.removeWatch(watchDestroyObj);
        }
    }

    async setData(data, args?: any) {
        if (data == null)
            return;
        var keyArr = new Array<string>();
        for (const key in data) {
            var value = data[key]
            if (this[key] == value)
                continue;
            this[key] = value;
            keyArr.push(key);
        };
        for (var key of keyArr) {
            await this.runCb(key, args);
        }
    }

    removeWatch(obj: any) {
        this.funcMap.forEach((map, key) => {
            if (map != null) {
                if (map.has(obj)) {
                    map.delete(obj);
                }
            }
        })
    }


    async runCb(key: string, args?: any) {
       
        if (!this.funcMap.has(key)) {
            return;
        }
        var map = this.funcMap.get(key);
        for (var obj of map.keys()) {
            var arr = map.get(obj);
            for (var funcName of arr) {
                await obj[funcName](args);
            }
        }

    }
}

