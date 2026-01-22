import { _decorator, Component, Node , native } from 'cc';
import {HttpUtils} from "../utils/HttpUtils";
const { ccclass, property } = _decorator;

@ccclass('ResourcesPathDefine')
export class ResourcesPathDefine {
    static UI_ROOT_PATH = "prefabs/ui";
    static UI_ITEM_ROOT_PATH = "prefabs/ui/item";
    static ROLE_ROOT_PATH = "prefabs/role";
    static ENEMY_ROOT_PATH = "prefabs/enemy";
    static FIRE_ROOT_PATH = "prefabs/fire";
    static MAP_ROOT_PATH = "prefabs/map";
    static BUILD_ROOT_PATH = "prefabs/building";
    static LINE_ROOT_PATH = "prefabs/line";
    static BOOM_ROOT_PATH = "prefabs/boom";
    static GAME_DATA_ROOT_PATH = "gameData";
    static ORDER_ROOT_PATH = "prefabs/order";
    static BUFF_ROOT_PATH = "prefabs/buff";
    static TEXTURES_PATH = "textures";

    static LOAD_ROOT_PATH = "prefabs/load";


    static SOUND_MAP: Map<number, Array<any>> = new Map([
        [0, ["audios/attack0.mp3",0.4]],
        [1, ["audios/attack1.mp3",0.4]],
        [2, ["audios/attack2.mp3", 0.2]],
        [3, ["audios/attack3.mp3", 0.7]],
        [4, ["audios/attack4.mp3", 0.6]],
        [5, ["audios/attack5.mp3", 0.15]],
        [6, ["audios/attack6.mp3", 0.1]],
        [7, ["audios/attack7.mp3", 0.2]],
        [8, ["audios/attack8.mp3", 1.1]],
    ])
}

