import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, Button } from 'cc';
import { PropBase } from '../base/PropBase';
import { AudioSys } from '../sys/AudioSys';
import { Functor } from './Functor';
import { SysMgr } from './SysMgr';


const { ccclass, property } = _decorator;

@ccclass('ClickFunctor')
export class ClickFunctor {
    functor: Functor;
    audioSys: AudioSys;
    constructor(functor: Functor) {
        this.functor = functor;
        this.audioSys = SysMgr.getSys(AudioSys);
    }
    runCbFunc(...arg: any) {
        if (this.functor != null)
            this.functor.runCbFunc(...arg);
        this.audioSys.playAudio("audios/touch.mp3");
    }
    static getFunc(obj: any, funName: string, ...arg: any) {

        var functor = new Functor(obj, funName, ...arg);
        var clickFunctor = new ClickFunctor(functor);
        return clickFunctor.runCbFunc.bind(clickFunctor);
    }
}

