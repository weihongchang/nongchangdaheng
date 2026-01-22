import { _decorator, Component, Node , native } from 'cc';
import {HttpUtils} from "../utils/HttpUtils";
const { ccclass, property } = _decorator;

@ccclass('EventDefine')
export class EventDefine {
    static KEY_EVENT_DOWN = "key_event_down";
    static KEY_EVENT_UP = "key_event_up";

    static WS_HALL_INIT = "hall_init";
    static WS_HALL_RECV_MSG = "recv_msg";
    static WS_HALL_GET_HERO_NUM = "get_hero_num";
    static WS_HALL_GET_ALL_MAP = "get_all_map";
    

    static WS_MAP_INIT = "map_init";
    static WS_MAP_REFRESH_PLAYER = "refresh_player";
    static WS_MAP_FIRE = "fire";
    static WS_MAP_COLLISION = "collision";


    static WS_LOGIN_OUT = "login_out";
}

