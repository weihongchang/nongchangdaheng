import { _decorator, Component, Node, loader, sys, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RandomUtils')
export class RandomUtils {
    static randomNum(min: any, max: any) {//不包括max
        return Math.floor(Math.random() * (max - min) + min)
    }
    static randomBoundary(minLeft: any, maxLeft: any, minRight: any, maxRight: any) {//不包括max
        if (RandomUtils.randomBool()) {
            return RandomUtils.randomNum(minLeft, maxLeft);
        }
        return RandomUtils.randomNum(minRight, maxRight);
    }
    static randomString(length: number): string {
        return Math.random()
            .toString(36)
            .replace(/[^a-zA-Z0-9]+/g, '')
            .substr(0, length);
    }
    static randomBool(): boolean {
        if (RandomUtils.randomNum(0, 2) == 1)
            return true;
        return false;
    }

}

