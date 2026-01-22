import { _decorator, Component, Node, __private } from 'cc';
import { SysMgr } from '../common/SysMgr';
import { ComBase } from './ComBase';
const { ccclass, property } = _decorator;

@ccclass('SysBase')
export class SysBase extends ComBase {


    addSys<T extends Component>(classConstructor: __private._types_globals__Constructor<T>): T | null {
        var com = this.addCom(classConstructor);
        return com;
    }

    removeSys<T extends Component>(classConstructor: __private._types_globals__Constructor<T> | __private._types_globals__AbstractedConstructor<T>): void {
        this.removeCom(classConstructor);
    }

}

