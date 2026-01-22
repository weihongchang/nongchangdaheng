import { _decorator, Component, Node, __private } from 'cc';
import { PropBase } from './PropBase';
const { ccclass, property } = _decorator;

@ccclass('AnimPropBase')
export class AnimPropBase extends PropBase {
    state: string = "idle";
}

