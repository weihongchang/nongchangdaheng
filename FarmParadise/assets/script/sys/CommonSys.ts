import { _decorator, Component, Node, game,Game } from 'cc';
import { ComBase } from '../base/ComBase';
import { SysBase } from '../base/SysBase';
import { KeyCom } from '../common/com/KeyCom';

const { ccclass, property } = _decorator;

@ccclass('CommonSys')
export class CommonSys extends SysBase {
    onLoad() {
        this.addCom(KeyCom);

        game.on(Game.EVENT_HIDE, function () {
            //console.log("hide");

        });


        game.on(Game.EVENT_SHOW, function () {
            //console.log("show");
        });
    }

}

