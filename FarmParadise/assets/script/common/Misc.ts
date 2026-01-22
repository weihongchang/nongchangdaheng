import { _decorator, Component, Node , native, SpriteFrame, Texture2D, ImageAsset, Sprite, misc, Vec2 } from 'cc';
import {HttpUtils} from "../utils/HttpUtils";
import { ResourceLoader } from './ResourceLoader';
import { ResourcesPathDefine } from './ResourcesPathDefine';
const { ccclass, property } = _decorator;

@ccclass('Misc')
export class Misc {
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static mapToString(map): string {
        let ro = {};
        for (var key of map.keys()) {
            ro[key] = map.get(key);
      
        }
        return JSON.stringify(ro);
    }

    static objToMap(obj): Map<string,any> {
        var map = new Map();
        for (const key in obj) {
            var value = obj[key];
            map.set(key, value);
        };
        return map;
    }


    static async setSprite(item, path) {
        let spriteFrame = new SpriteFrame();
        let texture = new Texture2D();
        texture.image = await ResourceLoader.loadAsset<ImageAsset>(path);
        spriteFrame.texture = texture;
        item.getComponent(Sprite).spriteFrame = spriteFrame;
    }


    static angleToDir(angle) {
        let radian = misc.degreesToRadians(angle)// cc 提供的将角度转换为弧度

        let comVec = new Vec2(0, 1);    // 一个水平向右的对比向量

        let dir = comVec.rotate(-radian);    // 将对比向量旋转给定的弧度返回一个新的向量
        return new Vec2(-dir.x, dir.y)
    }
}

