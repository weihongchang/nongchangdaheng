import { _decorator, Component, Node, Button, Label, Sprite, SpriteFrame, loader, NodeEventType, Texture2D, RenderTexture, assetManager, ImageAsset, EditBox, input, Input, EventKeyboard, KeyCode, Vec3, Vec2, tween, misc } from 'cc';
import { ClickFunctor } from '../../common/ClickFunctor';
import { WsCom } from '../../common/com/WsCom';
import { EventDefine } from '../../common/EventDefine';
import { Functor } from '../../common/Functor';
import { GlobalVar } from '../../common/GlobalVar';
import { HeroProp } from '../../common/HeroProp';
import { IntervalMgr } from '../../common/IntervalMgr';
import { Misc } from '../../common/Misc';
import { ResourceLoader } from '../../common/ResourceLoader';
import { ResourcesPathDefine } from '../../common/ResourcesPathDefine';
import { SysMgr } from '../../common/SysMgr';
import { FireCom } from '../../game/FireCom';
import { InputCom } from '../../game/InputCom';
import { PlayerCom } from '../../game/PlayerCom';
import { PredictCom } from '../../game/PredictCom';
import { DlgSys } from '../../sys/DlgSys';
import { EventSys } from '../../sys/EventSys';
import { HeroSys } from '../../sys/HeroSys';
import { TimeSys } from '../../sys/TimeSys';
import { WsSys } from '../../sys/WsSys';
import { HttpUtils } from '../../utils/HttpUtils';
import { RandomUtils } from '../../utils/RandomUtils';
import { StorageUtils } from '../../utils/StorageUtils';
import { LoginDlg } from '../ui/LoginDlg';
import { MapDlg } from '../ui/MapDlg';
import { BubbleTipDlgCom } from './BubbleTipDlgCom';
import { InterruptDlgCom } from './InterruptDlgCom';
import { MainDlgCom } from './MainDlgCom';
const { ccclass, property } = _decorator;

@ccclass('MapDlgCom')
export class MapDlgCom extends MapDlg {
    data?: any;
    heroProp: HeroProp;
    ws: WsCom;
    loopTime = 0.01;

    addCount = 0;
    m_Player: Node;
    playerMap = new Map<string, Node>();
    fireMap = new Map<string, Node>();
    isStart = false;
    async initDlg(data?: any) {
        super.initDlg(data);
        await SysMgr.getSys(DlgSys).createDlg(InterruptDlgCom, "加载中...");
        await this.initAsset();
        this.initEvent();
        this.initWs(data.ws)


        this.refreshUserName(this.heroProp)
    }

    async initAsset() {//预加载
        for (let i = 0; i < 10; i++)
            await ResourceLoader.loadAsset<ImageAsset>(ResourcesPathDefine.TEXTURES_PATH + "/pic/" + i);
    }


    initEvent() {

        this.heroProp = SysMgr.ins.getCom(HeroSys).heroProp;
        this.heroProp.watch("user_name", this, "refreshUserName");
        this.m_ExitButton.on("click", ClickFunctor.getFunc(this, "onExit"), this);

        var eventSys = SysMgr.getSys(EventSys)
        eventSys.watchEvent(EventDefine.WS_MAP_REFRESH_PLAYER, this, "net_RefreshPlayer");
        eventSys.watchEvent(EventDefine.WS_MAP_FIRE, this, "net_AddFire");
        eventSys.watchEvent(EventDefine.WS_MAP_COLLISION, this, "net_Collision");
        eventSys.watchEvent(EventDefine.WS_MAP_INIT, this, "net_MapInit");

        eventSys.watchEvent(EventDefine.KEY_EVENT_DOWN + KeyCode.KEY_J.toString(), this, "sendFire");
    }

    sendFire() {
        if (!this.isStart)
            return;

        let dir = Misc.angleToDir(this.m_Player.angle)
        dir = dir.normalize()
        let data = {
            x: Math.ceil(this.m_Player.position.x * 1000),
            y: Math.ceil(this.m_Player.position.y * 1000),
            dir_x: Math.ceil(dir.x * 1000),
            dir_y: Math.ceil(dir.y * 1000),

        }
        this.ws.sendMsg("fire", data)
    }

    initWs(ws) {
        var url = GlobalVar.wsUrl + ws;
        this.ws = SysMgr.getSys(WsSys).addWs("map", this.heroProp.uid, url)
        this.m_RoomLabel.getComponent(Label).string = url
    }

    async net_MapInit(data) {
        this.addComponent(PredictCom)
        this.addComponent(InputCom).init()
        //await this.net_RefreshPlayer(data)
        SysMgr.getSys(TimeSys).addTimer(this, "loop", this.loopTime, true);

        SysMgr.getSys(DlgSys).closeDlg(InterruptDlgCom);
        this.isStart = true;
    }
  
    loop(dt: number) {
        this.addCount++;
        for (var uid of this.playerMap.keys()) {
            let item = this.playerMap.get(uid)
            item.getComponent(PlayerCom).loop()
        }
        if (this.addCount % 10 == 0) {
            this.netLoop()
        }
        this.checkCollision();
       
    }

    checkCollision() {
        for (let fire_id of this.fireMap.keys()) {
            var fire = this.fireMap.get(fire_id);
            for (var player_id of this.playerMap.keys()) {
                if (fire.getComponent(FireCom).player_id == player_id)
                    continue;

                if (player_id == this.m_Player.getComponent(PlayerCom).player_id)
                    continue

                let player = this.playerMap.get(player_id)

                if (Vec3.distance(fire.position, player.position) < 35) {
                    this.ws.sendMsg("collision", {
                        fire_x: Math.ceil(fire.position.x * 1000),
                        fire_y: Math.ceil(fire.position.y * 1000),
                        player_x: Math.ceil(player.position.x * 1000),
                        player_y: Math.ceil(player.position.y * 1000),
                        player_id: player_id,
                        fire_id: fire_id,
                    })
                }

            }

        }
    }

    netLoop() {
        let playerPos = this.m_Player.position
        let dir = this.getComponent(InputCom).dir;
        let dirX = Math.ceil(dir.x * 1000)
        let dirY = Math.ceil(dir.y * 1000)
        let oldX = Math.ceil(playerPos.x * 1000)
        let oldY = Math.ceil(playerPos.y * 1000)


        let predictCom = this.getComponent(PredictCom)
        predictCom.predict(oldX / 1000, oldY / 1000, dirX / 1000, dirY / 1000)
        for (let i = 0; i < 10; i++) {
            predictCom.loop()
        }
        let targetPos = predictCom.getPos();
        let predictDir = predictCom.getPredictDir()
        let x = Math.ceil(targetPos.x * 1000);
        let y = Math.ceil(targetPos.y * 1000);
        let predictDirX = Math.ceil(predictDir.x * 1000);
        let predictDirY = Math.ceil(predictDir.y * 1000);

        this.ws.sendMsg("send_pos", {
            old_x: oldX,
            old_y: oldY,
            x: x,
            y: y,
            dir_x: predictDirX,
            dir_y: predictDirY,

        })

        this.m_Player.getComponent(PlayerCom).moveTo(oldX / 1000, oldY / 1000, x / 1000, y / 1000, predictDirX / 1000, predictDirY / 1000, true)
    }

    net_Collision(collision_data) {
        let player = this.playerMap.get(collision_data.player_id)
        let fire = this.fireMap.get(collision_data.fire_id)

        if (fire != null)
            this.destroyFire(collision_data.fire_id)
        if (player != null) {
            player.getComponent(PlayerCom).stop(collision_data.player_x / 1000, collision_data.player_y / 1000);
        }

    }

    async net_RefreshPlayer(refresh_data) {
        var playerSet = new Set()
        for (var player_data of refresh_data.all_player) {
            if (!this.playerMap.has(player_data.uid))
                await this.addPlayer(player_data)
            let playerNode = this.playerMap.get(player_data.uid)
            await playerNode.getComponent(PlayerCom).refreshPlayer(player_data)

            playerSet.add(player_data.uid)
        }

        for (var uid of this.playerMap.keys()) {
            
            if (!playerSet.has(uid)) {
                await this.destroyPlayer(uid)
            }
        }

    }

    async destroyPlayer(uid) {

        if (!this.playerMap.has(uid))
            return;
        let item = this.playerMap.get(uid)
        await BubbleTipDlgCom.createTip(item.getComponent(PlayerCom).user_name + "退出了场景");

        if (item != null)
            item.destroy();
        this.playerMap.delete(uid)
    }

    async addPlayer(player) {
        await this.destroyPlayer(player.uid)

        let item = await ResourceLoader.insNode(ResourcesPathDefine.UI_ITEM_ROOT_PATH + "/PlayerItem");
        item.parent = this.node
        if (player.uid == this.heroProp.uid) {
            await item.addComponent(PlayerCom).init(player.uid, player.sprite_type, player.user_name);
            this.m_Player = item;
        }
        else {
            await item.addComponent(PlayerCom).init(player.uid, player.sprite_type, player.user_name);
        }

        this.playerMap.set(player.uid, item)
        await BubbleTipDlgCom.createTip(player.user_name + "进入了场景");
    }

    async net_AddFire(add_fire_data) {
        let moveTime = 2
        let fire = await ResourceLoader.insNode(ResourcesPathDefine.FIRE_ROOT_PATH + "/0");
        fire.parent = this.node;
        fire.position = new Vec3(add_fire_data.x / 1000, add_fire_data.y / 1000, 0)
        fire.addComponent(FireCom).init(add_fire_data, moveTime)
        


        tween(this.node).delay(moveTime).call(Functor.getFunc(this, "destroyFire", add_fire_data.fire_id)).start()
        this.fireMap.set(add_fire_data.fire_id, fire)
    }

    destroyFire(fire_id) {
        if (!this.fireMap.has(fire_id))
            return
        let obj = this.fireMap.get(fire_id)
        obj.destroy()
        this.fireMap.delete(fire_id)
    }

    refreshUserName(heroProp: HeroProp) {
        this.m_NameLabel.getComponent(Label).string = heroProp.user_name;
    }

    @IntervalMgr.Lock()
    async onExit() {
       
        var result = await HttpUtils.post(GlobalVar.httpUrl + "/api/relam0/get_hall_ws", JSON.stringify({
            uid: this.heroProp.uid
        }))
        var obj = JSON.parse(result)
        if (obj.success == true) {
            SysMgr.getSys(WsSys).removeWs("map")
            await SysMgr.getSys(DlgSys).createDlg(MainDlgCom, {
                uid: this.heroProp.uid,
                ws: obj.data.ws
            });
            this.closeDlg(MapDlgCom);
        }

    }
}