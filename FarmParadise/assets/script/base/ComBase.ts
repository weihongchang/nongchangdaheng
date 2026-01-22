import { _decorator, Component, Node, __private } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComBase')
export class ComBase extends Component {
    comMap = new Map<string, Node>();
    addCom<T extends Component>(classConstructor: __private._types_globals__Constructor<T>): T | null {
        var obj = new Node();
        obj.name = classConstructor.prototype.name;
        obj.parent = this.node;
        var com = obj.addComponent(classConstructor);
        this.comMap.set(classConstructor.prototype.name, obj);
        return com;
    }

    getCom<T extends Component>(classConstructor: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>): T | null {
        var obj = this.comMap.get(classConstructor.prototype.name);
        if (obj != null)
            return obj.getComponent(classConstructor);
        return null;
    }

    removeCom<T extends Component>(classConstructor: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>): void {
        var obj = this.comMap.get(classConstructor.prototype.name);
        if (obj != null)
            obj.destroy();
        this.comMap.delete(classConstructor.prototype.name);
    }
}

