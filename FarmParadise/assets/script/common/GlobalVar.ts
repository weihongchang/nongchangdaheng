import { _decorator, Camera, Component, Node, Prefab } from 'cc';
import { PlayerCom } from '../game/PlayerCom';
import { CameraControl } from '../game/CameraControl';
import { Level } from '../game/Level';
import { MapDataImp } from '../game/Data/MapDataImp';
import { MapData } from '../data/MapData';
const { ccclass, property } = _decorator;

@ccclass('GlobalVar')
export class GlobalVar{
    static isTest = false;
    static isWX = false;
    static canvas: Node;
    static gamePanel: Node;
    static httpUrl: string = "http://127.0.0.1:6888";
    static wsUrl: string = "ws://127.0.0.1:6888";

    static gameRoot: Node;

    // static httpUrl: string = "http://121.28.168.102:6888";
    // static wsUrl: string = "ws://121.28.168.102:6888";

    //当前地图
    static mapId: number = 0;
    //json
    

    //主角脚本
    static player: PlayerCom;
    static bagMax: number = 20;

    static isFirstBagMax: boolean = true;

    
    ////////////////////////摄像机相关///////////////////////////////////////
    static mainCamera:Camera;
    static CameraControl:CameraControl;
    //摄像机是否移动
    static cameraMoving: boolean = false;
    static cameraOrthoHeight: number = 7;
    static cameraNearOrthoHeight: number = 7;
    ////////////////////////摄像机相关///////////////////////////////////////


    //////////////////////////关卡相关///////////////////////////////////////
    static level: number = 2;
    static map: Level[]=[];
    static eatTime: number = 1;
    static machineTime: number = 1;
    //////////////////////////关卡相关///////////////////////////////////////

    //#region 预制体
    //////////////////////////预制体///////////////////////////////////////
    static woodPrefab:Prefab;
    //////////////////////////预制体///////////////////////////////////////


}

