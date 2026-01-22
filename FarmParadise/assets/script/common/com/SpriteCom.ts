import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, game, loader, assetManager, Texture2D, SpriteFrame, Sprite } from 'cc';
import { ComBase } from '../../base/ComBase';
import { ResourceLoader } from '../ResourceLoader';
import { ResourcesPathDefine } from '../ResourcesPathDefine';


const { ccclass, property } = _decorator;

@ccclass('SpriteCom')
export class SpriteCom extends ComBase {
    path: string;
    async setSprite(path: string) {
        this.path = path;
        this.getComponent(Sprite).spriteFrame =await ResourceLoader.loadAsset<SpriteFrame>(path);
    }

    onDestroy() {
        ResourceLoader.releaseAsses(this.path);
    }
}

