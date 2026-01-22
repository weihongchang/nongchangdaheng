import { _decorator, Component, Node, loader, sys, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameRandomUtils')
export class GameRandomUtils {

    public static seed: number;
    public static init(seed: number) {
        GameRandomUtils.seed = seed;
    }

    public static gameRandomNum(min: number, max: number): number {//不包括max
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280.0;
        return min + rnd * (max - min);
    }

    public static gameRandomBool(): boolean {
        if (GameRandomUtils.gameRandomNum(0, 2) > 1) {
            return true;
        }
        return false;
    }

}

