import { _decorator, Component, Node, __private } from 'cc';
import { DestroyCB } from '../common/DestroyCB';

const { ccclass, property } = _decorator;

@ccclass('PropBase')
export class PropBase extends Component {
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

    setData(data) {
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
            this.runCb(key);
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


    runCb(key: string) {
        if (!this.funcMap.has(key)) {
            return;
        }
        var map = this.funcMap.get(key);
        map.forEach((arr, obj) => {
            if (arr != null)
                for (var funcName of arr) {
                    obj[funcName](this);
                }
        })

        
    }
}

