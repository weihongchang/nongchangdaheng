import { _decorator, Component, Node , native } from 'cc';
import { PoolSys } from '../sys/PoolSys';
import { ResourceLoader } from './ResourceLoader';
import { ResourcesPathDefine } from './ResourcesPathDefine';
import { SysMgr } from './SysMgr';
const { ccclass, property } = _decorator;

@ccclass('PreLoad')
export class PreLoad {

    static resArr: Array<string> = [
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy0",
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy1",
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy2",
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy3",
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy4",
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy5",
        //ResourcesPathDefine.ENEMY_ROOT_PATH + "/enemy6",

        //ResourcesPathDefine.ROLE_ROOT_PATH + "/role0",
        //ResourcesPathDefine.ROLE_ROOT_PATH + "/role1",
        //ResourcesPathDefine.ROLE_ROOT_PATH + "/role2",
        //ResourcesPathDefine.ROLE_ROOT_PATH + "/role3",
        //ResourcesPathDefine.ROLE_ROOT_PATH + "/role4",

        //ResourcesPathDefine.FIRE_ROOT_PATH + "/fire0",
        //ResourcesPathDefine.FIRE_ROOT_PATH + "/fire1",
        //ResourcesPathDefine.FIRE_ROOT_PATH + "/fire2",

        //ResourcesPathDefine.BOOM_ROOT_PATH + "/boom0",
        //ResourcesPathDefine.BOOM_ROOT_PATH + "/boom1",

        //ResourcesPathDefine.ORDER_ROOT_PATH + "/order0",

        //"audios/touch.mp3",
    ];

    static nodeMap: Map<string, number> = new Map([
        //[ResourcesPathDefine.FIRE_ROOT_PATH + "/fire0", 30],
        //[ResourcesPathDefine.FIRE_ROOT_PATH + "/fire1", 15],
        //[ResourcesPathDefine.FIRE_ROOT_PATH + "/fire2", 10],
        //[ResourcesPathDefine.FIRE_ROOT_PATH + "/fire3", 10],
        //[ResourcesPathDefine.FIRE_ROOT_PATH + "/fire4", 10],
        //[ResourcesPathDefine.FIRE_ROOT_PATH + "/fire5", 10],
    ]);
    static async preloadRes() {
        for (var resPath of PreLoad.resArr) {
            await ResourceLoader.loadAsset(resPath);
        }

        for (var args of ResourcesPathDefine.SOUND_MAP.values()) {
            await ResourceLoader.loadAsset(args[0]);
        }
    }

    static async preloadNode() {
        var poolSys = SysMgr.getSys(PoolSys);
        var objArr = new Array<Node>();
        for (var path of PreLoad.nodeMap.keys()) {
            var count = PreLoad.nodeMap.get(path);
            for (var i = 0; i < count; i++) {
                var obj = await poolSys.createNode(path);
                objArr.push(obj);
            }
        }

        for (var obj of objArr) {
            await poolSys.destroyNode(obj);
        }
    }

}

