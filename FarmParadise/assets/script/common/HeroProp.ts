import { _decorator, Component, Node, __private } from 'cc';
import { PropBase } from '../base/PropBase';
const { ccclass, property } = _decorator;

@ccclass('HeroProp')
export class HeroProp extends PropBase {
    uid: string = "0";
    user_name: string = "0";

}

