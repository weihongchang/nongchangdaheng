import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Button } from 'cc';
import { PropBase } from '../base/PropBase';
import { DestroyCB } from './DestroyCB';


const { ccclass, property } = _decorator;

@ccclass('Functor')
export class Functor {
    obj: any;
    funcName: string;
    arg;
    isDestroy = false;
    constructor(obj: any, funcName: string, ...arg: any) {
        this.obj = obj;
        this.funcName = funcName;
        this.arg = arg;
    }
    onObjDestroy(watchDestroyObj: any) {
        this.isDestroy = true;
    }
    runCbFunc(...arg: any) {

        if (this.obj != null && this.obj[this.funcName] != null && !this.isDestroy)
            this.obj[this.funcName](...this.arg, ...arg);
    }
    static getFunc(obj: any, funName: string, ...arg: any) {
        var functor = new Functor(obj, funName, ...arg);
        DestroyCB.addCb(obj, functor, "onObjDestroy");
        return functor.runCbFunc.bind(functor);
    }

    static getNotWatchDestroyFunc(obj: any, funName: string, ...arg: any) {
        var functor = new Functor(obj, funName, ...arg);
        return functor.runCbFunc.bind(functor);
    }
}

