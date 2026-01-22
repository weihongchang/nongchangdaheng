import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, loader, assetManager, Texture2D, tween, Vec3, Vec2, TweenAction, Tween } from 'cc';
import { ComBase } from '../base/ComBase';
import { Functor } from '../common/Functor';
import { PredictCom } from './PredictCom';


const { ccclass, property } = _decorator;




@ccclass('FireCom')
export class FireCom extends ComBase {

    fire_id;
    player_id;
    init(data, moveTime) {
        this.fire_id = data.fire_id;
        this.player_id = data.player_id;
        let target_pos = new Vec3(data.x / 1000 + data.dir_x / 1000 * 2000, data.y / 1000 + data.dir_y / 1000 * 2000, 0)
        tween(this.node).to(moveTime, {
            position: target_pos
        }).start()
        
    }

}

