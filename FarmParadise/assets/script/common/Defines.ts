import { _decorator, Component, Node , native } from 'cc';
import {HttpUtils} from "../utils/HttpUtils";
const { ccclass, property } = _decorator;

@ccclass('Defines')
export class Defines {
    static CHAR_ROLE = 0;
    static CHAR_ENEEMY = 1;

    static USER_ID = "user_id";
    static LEVEL_DATA = "level_data";

    static GAMEOBJ_TYPE_ROLE = 0;
    static GAMEOBJ_TYPE_ENEMY = 1;
    static GAMEOBJ_TYPE_ORDER = 2;
}

