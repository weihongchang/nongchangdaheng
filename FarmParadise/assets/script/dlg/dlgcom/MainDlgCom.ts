import { _decorator, Component, Node, Button, Label, Sprite, SpriteFrame, loader, NodeEventType, Texture2D, RenderTexture, assetManager, ImageAsset, EditBox, HorizontalTextAlignment, ScrollView, Prefab, instantiate, ProgressBar, randomRangeInt, Vec3, v3 } from 'cc';
import { ClickFunctor } from '../../common/ClickFunctor';
import { WsCom } from '../../common/com/WsCom';
import { EventDefine } from '../../common/EventDefine';
import { GlobalVar } from '../../common/GlobalVar';
import { HeroProp } from '../../common/HeroProp';
import { IntervalMgr } from '../../common/IntervalMgr';
import { ResourceLoader } from '../../common/ResourceLoader';
import { ResourcesPathDefine } from '../../common/ResourcesPathDefine';
import { SysMgr } from '../../common/SysMgr';
import { DlgSys } from '../../sys/DlgSys';
import { EventSys } from '../../sys/EventSys';
import { HeroSys } from '../../sys/HeroSys';
import { WsSys } from '../../sys/WsSys';
import { HttpUtils } from '../../utils/HttpUtils';
import { StorageUtils } from '../../utils/StorageUtils';
import { LoginDlg } from '../ui/LoginDlg';
import { MainDlg } from '../ui/MainDlg';
import { BubbleTipDlgCom } from './BubbleTipDlgCom';
import { InterruptDlgCom } from './InterruptDlgCom';
import { MapDlgCom } from './MapDlgCom';
import { PlayerCom } from '../../game/PlayerCom';
import { LodingDlgCom } from './LodingDlgCom';
import { LodingDlg } from '../ui/LodingDlg';
import { LoginDlgCom } from './LoginDlgCom';
import { Level } from '../../game/Level';
import { Animal } from '../../game/object/Animal';
import { levelUpTipDlgCom } from './levelUpTipDlgCom';
import { DataManager } from '../../game/DataManager';
import { BuildData } from '../../data/BuildData';
import { LineDataImp } from '../../game/Data/LineDataImp';
const { ccclass, property } = _decorator;

@ccclass('MainDlgCom')
export class MainDlgCom extends MainDlg {
    data?: any;
    ws: WsCom;
    heroProp: HeroProp;
    mapWsArr = [];

    mapNode: Node;

    moneyLabel: Label;
    
    async initDlg(data?: any) {
        super.initDlg(data);
        await SysMgr.getSys(DlgSys).createDlg(InterruptDlgCom, "加载中...");
        this.initEvent()
        DataManager.initMap()
        // this.initWs(data.uid, data.ws)
        GlobalVar.player = GlobalVar.gameRoot.getChildByName('player').getComponent(PlayerCom);
        GlobalVar.player.node.active = true

        // GlobalVar.CameraControl.cameraFollow(GlobalVar.player.node);
        // GlobalVar.player.init(data.uid, data.sprite_type, data.user_name)

        // GlobalVar.gameRoot.getChildByName('lv1').active = true
        this.moneyLabel = this.m_moneyNum.getComponent(Label);

        this.m_SendEditBox.getComponent(EditBox).string = "你好"
        this.heroProp.setData({
            uid:data.uid
        })

        this.initAsset();
        this.initData();
    }

     async initAsset() {//预加载
        
        //加载load目录得所有预制体
        ResourceLoader.loadAsset<Prefab>(ResourcesPathDefine.LOAD_ROOT_PATH + "/Wood").then(async (obj) => {
            GlobalVar.woodPrefab = obj;
        });

        //加载地图资源
        ResourceLoader.loadAsset<Prefab>(ResourcesPathDefine.MAP_ROOT_PATH + "/map"+ (GlobalVar.mapId+1)).then(async (obj) => {
            this.mapNode =  instantiate(obj)
            GlobalVar.gameRoot.addChild(this.mapNode);

            let mapImp =  DataManager.getMapData(GlobalVar.mapId)
            let currentLineID = mapImp.currentLineID;
            for(let i = 0; i < mapImp.lineList.length; i++)
            {
                let lineImp =  mapImp.lineList[i];
                let id =  lineImp.num;
                if( id> currentLineID )
                {
                    //不加载未开放的生产线
                    continue;
                }

                let lineBuildID = lineImp.currentBuildID;

                ResourceLoader.loadAsset<Prefab>(ResourcesPathDefine.LINE_ROOT_PATH + "/line" + id ).then(async (obj) => { 
                    
                    let line = instantiate(obj)
                    line.setParent(this.mapNode);
                    
                    //添加位置
                    let positionStr = lineImp.linePosition;
                    let positionArray = positionStr.split(',').map(Number);
                    let positionVec3 = new Vec3(positionArray[0], positionArray[1], positionArray[2]);
                    line.setPosition(positionVec3)

                    let buildIDlist=  lineImp.buildID.toString().split(",");

                    for( let buildID of buildIDlist )
                    {
                        let build = BuildData.data.get(parseInt(buildID));
                        
                        if(line.getChildByName(build.prefabPath))
                        {
                            let buildNode = line.getChildByName(build.prefabPath);
                            let posArray =   build.buildPosition.toString().split(",").map(Number)
                            buildNode.setPosition( v3(posArray[0],posArray[1],posArray[2]))
                            if( build.num <= lineBuildID )
                            {
                                buildNode.active = true;
                            }
                            else
                            {
                                buildNode.active = false;
                            }
                        }
                    }

                    let  lineLevel = line.getComponent(Level);
                    lineLevel.lineIndex = i;
                    lineLevel.initLevelIndex();

                    GlobalVar.map.push(lineLevel);
                    SysMgr.getSys(DlgSys).closeDlg(InterruptDlgCom);
                    SysMgr.getSys(DlgSys).getDlg(LoginDlg).getComponent(LoginDlgCom).isLoadingComplete = true;
                    SysMgr.getSys(DlgSys).getDlg(LodingDlg).getComponent(LodingDlgCom).isloadcomplete = true;
                    console.log("加载完成")
                });

            }
            // ResourceLoader.loadAssetList<Prefab>([
            //     ResourcesPathDefine.BUILD_ROOT_PATH + "/carRoot",
            //     ResourcesPathDefine.BUILD_ROOT_PATH + "/售卖点",
            //     ResourcesPathDefine.BUILD_ROOT_PATH + "/地块",
            //     ResourcesPathDefine.BUILD_ROOT_PATH + "/牛奶加工",
            //     ResourcesPathDefine.BUILD_ROOT_PATH + "/牛棚",
            // ]).then(prefabs => { 
            //     for (var prefab of prefabs) {
            //         console.log(prefab.name);
            //     }
            //     GlobalVar.map = this.mapNode.getComponent(Level);
            //     SysMgr.getSys(DlgSys).closeDlg(InterruptDlgCom);
            //     SysMgr.getSys(DlgSys).getDlg(LoginDlg).getComponent(LoginDlgCom).isLoadingComplete = true;
            //     SysMgr.getSys(DlgSys).getDlg(LodingDlg).getComponent(LodingDlgCom).isloadcomplete = true;
            //     console.log("加载完成")
            // });

            
            
        });

    }


    async initData() {
        
        this.moneyLabel.string =  GlobalVar.player.money.toString();


    }


    initWs(uid, ws) {
        var url = GlobalVar.wsUrl + ws;
        this.ws = SysMgr.getSys(WsSys).addWs("hall", uid, url)
    }
    net_HallInit(data) {
        this.heroProp.setData({
            user_name: data.user_name
        })
        this.m_NumLabel.getComponent(Label).string = "当前在线人数:" + data.num.toString();
        SysMgr.getSys(DlgSys).closeDlg(InterruptDlgCom);
        this.ws.sendMsg("get_all_map", {});

    }

    initEvent() {
        this.heroProp = SysMgr.ins.getCom(HeroSys).heroProp;
        this.heroProp.watch("user_name", this, "refreshUserName");

        this.m_SendBtn.on("click", ClickFunctor.getFunc(this, "onSend"), this);
        this.m_EnterBtn0.on("click", ClickFunctor.getFunc(this, "onEnter", 0), this);
        this.m_EnterBtn1.on("click", ClickFunctor.getFunc(this, "onEnter", 1), this);

        this.m_funBtn1.on("click", ClickFunctor.getFunc(this, "onMapChange", 1), this);
        this.m_funBtn2.on("click", ClickFunctor.getFunc(this, "onMapChange", 2), this);
        this.m_funBtn3.on("click", ClickFunctor.getFunc(this, "onMapChange", 3), this);
        this.m_funBtn4.on("click", ClickFunctor.getFunc(this, "onMapChange", 4), this);
        this.m_funBtn5.on("click", ClickFunctor.getFunc(this, "onMapChange", 5), this);

        var eventSys = SysMgr.getSys(EventSys)
        eventSys.watchEvent(EventDefine.WS_HALL_INIT, this, "net_HallInit");
        eventSys.watchEvent(EventDefine.WS_HALL_RECV_MSG, this, "net_RecvMsg");
        eventSys.watchEvent(EventDefine.WS_HALL_GET_HERO_NUM, this, "net_GetHeroNum");
        eventSys.watchEvent(EventDefine.WS_HALL_GET_ALL_MAP, this, "net_GetAllMap");

        eventSys.watchEvent('refreshMoney', this, "refreshMoney");
    }
    refreshUserName(heroProp: HeroProp) {
        this.m_NameLabel.getComponent(Label).string = heroProp.user_name;
    }

    refreshMoney() {
        this.moneyLabel.string =  GlobalVar.player.money.toString();
    }


    net_GetHeroNum(data) {
        this.m_NumLabel.getComponent(Label).string = "当前在线人数:" + data.num.toString();
    }

    async net_GetAllMap(map_data) {
        this.m_MapContent0.removeAllChildren()
        this.m_MapContent1.removeAllChildren()
        this.mapWsArr = []
        let data = map_data["map_data"]
        var map0 = data[0]
        this.mapWsArr.push(map0.ws)
        for (let player of map0.all_player) {
            let item = await ResourceLoader.insNode(ResourcesPathDefine.UI_ITEM_ROOT_PATH + "/MapItem");
            item.getComponent(Label).string = player.user_name
            item.parent = this.m_MapContent0
 
        }

        var map1 = data[1]
        this.mapWsArr.push(map1.ws)
        for (let player of map1.all_player) {
            let item = await ResourceLoader.insNode(ResourcesPathDefine.UI_ITEM_ROOT_PATH + "/MapItem");
            item.getComponent(Label).string = player.user_name
            item.parent = this.m_MapContent1

        }

    } 

    async net_RecvMsg(data) {
        if (data.uid != this.heroProp.uid) {
            let item = await ResourceLoader.insNode(ResourcesPathDefine.UI_ITEM_ROOT_PATH + "/ChatItem");
            item.getChildByName("NameLabel").getComponent(Label).string = data.user_name;
            item.getChildByName("Label").getComponent(Label).string = data.msg;
            item.parent = this.m_Content
        } else {
            let item = await ResourceLoader.insNode(ResourcesPathDefine.UI_ITEM_ROOT_PATH + "/ChatItem");
            item.getChildByName("NameLabel").getComponent(Label).string = data.user_name;
            item.getChildByName("NameLabel").getComponent(Label).horizontalAlign = HorizontalTextAlignment.RIGHT

            item.getChildByName("Label").getComponent(Label).string = data.msg;
            item.getChildByName("Label").getComponent(Label).horizontalAlign = HorizontalTextAlignment.RIGHT
            item.parent = this.m_Content
        }
        this.m_ScrollView.getComponent(ScrollView).scrollToBottom();

    }

    @IntervalMgr.checkInterval(1, "发送过于频繁")
    onSend() {
        this.ws.sendMsg("send_msg", {
            msg: this.m_SendEditBox.getComponent(EditBox).string
        });

    }

    protected update(dt: number): void {
        
    }

    @IntervalMgr.Lock()
    async onEnter(wsIndex) {
        if (wsIndex >= this.mapWsArr.length)
            return;
        let ws = this.mapWsArr[wsIndex]


        this.closeDlg(MainDlgCom)
        await SysMgr.getSys(DlgSys).createDlg(MapDlgCom, {
            ws: ws
        })
        SysMgr.getSys(WsSys).removeWs("hall")
        BubbleTipDlgCom.createTip("进入成功")


    }



    @IntervalMgr.Lock()
    async onMapChange(wsIndex) {
        
        if( wsIndex == 5 )
        {
            //加钱测试
            // GlobalVar.map.addMoney(1000,GlobalVar.player.node.worldPosition.clone())

            //升级ui测试
            levelUpTipDlgCom.createTip(randomRangeInt(1,5));


            //加速测试
            // GlobalVar.eatTime -= .1;


            // for (let i = 0; i < GlobalVar.map.niu.length; i++) {
            //     GlobalVar.map.niu[i].getComponent(Animal).updateEatTime()
            // }
            return ;
        }
        // await SysMgr.getSys(DlgSys).createDlg(LodingDlgCom);
        // this.mapNode.destroy()
        // ResourceLoader.loadAsset<Prefab>(ResourcesPathDefine.MAP_ROOT_PATH + "/lv"+wsIndex).then(async (obj) => {
        //     this.mapNode =  instantiate(obj)
        //     GlobalVar.gameRoot.addChild(this.mapNode);
        //     GlobalVar.map = this.mapNode.getComponent(Level);
        //     await SysMgr.getSys(DlgSys).closeDlg(LodingDlgCom);

        //     BubbleTipDlgCom.createTip("切换场景"+wsIndex+"成功！")
            
        // });


    }

  
}