import { _decorator, Component, instantiate, math, Node, randomRangeInt, tween, v3, Vec3 } from 'cc';
import { GlobalVar } from '../../common/GlobalVar';
import { Utils } from '../../tools/Utils';
import { Cangku } from './Cangku';
import { levelUpTipDlgCom } from '../../dlg/dlgcom/levelUpTipDlgCom';
import { SysMgr } from '../../common/SysMgr';
import { EventSys } from '../../sys/EventSys';
const { ccclass, property } = _decorator;



export enum DitieType {
    TJWood,//提交木头 0
    SHMilk,//收取奶瓶 1
    TJMilk,//提交奶瓶 2
    SHFOOD,//收取食物 3
    TJFood,//提交食物到售卖点 4
    SHMoney,//收集钱 5
    upgread,//弹升级 6
}

@ccclass('Ditie')
export class Ditie extends Component {

    @property({
        // type: DitieType,
        displayName: '地贴类型:0提交木头;1收取奶瓶;2提交奶瓶;3收取食物到背包;4提交食物到售卖点;5收取钱;6升级'
    })
    dtType: DitieType = DitieType.TJWood;

    @property({
        type: Number,
        displayName: '地贴ID'
    })
    dtID: number = 0;

    @property({
        type: [Node],
        displayName: '需要数量百十个'
    })
    Num: Node[] = [];

    @property({
        type: Node,
        displayName: '地贴图标'
    })
    icon: Node = null;

    //地贴是否可用
    isCanUse = true;

    lineIndex = 0;


    isUpgradeShow  = false;

    //所属建筑id
    buildId  = 0;
    start() {

    }
    

    update(deltaTime: number) {

        if( this.isCanUse )
        {
            this.isCanUse = false;
            const playerPos = GlobalVar.player.node.worldPosition;
            
            // 计算playerPos与当前节点位置的距离
            const distance = Vec3.distance(playerPos, this.node.worldPosition);
            
            // 判断距离是否小于3
            if (distance < 1) {
                switch (this.dtType) {
                    case DitieType.TJWood:
                        this.woodToDitie();
                        break
                    case DitieType.SHMilk:
                        GlobalVar.map[this.lineIndex].milkTobagFromNiupeng( () => {
                            this.isCanUse = true;
                        } )
                        break;
                    case DitieType.TJMilk:
                        this.milkToDitie();
                        break;
                    case DitieType.SHFOOD:
                        GlobalVar.map[this.lineIndex].foodTobag( () => { 
                            this.isCanUse = true;
                        } )
                        break;
                    case DitieType.TJFood:
                        this.FoodToSellPoint();
                        break;
                    case DitieType.SHMoney:
                        GlobalVar.map[this.lineIndex].shouMoney(() => { 
                            this.isCanUse = true;
                        } )
                        break;
                    case DitieType.upgread:
                        this.isUpgradeShow  = true;
                        levelUpTipDlgCom.createTip(randomRangeInt(1, 6))
                        
                        break;
                }
            }
            else
            {
                if( this.isUpgradeShow )
                {
                    const playerPos = GlobalVar.player.node.worldPosition;
            
                    // 计算playerPos与当前节点位置的距离
                    const distance = Vec3.distance(playerPos, this.node.worldPosition);
                    
                    // 判断距离是否小于3
                    if (distance > 1) {
                        var eventSys = SysMgr.getSys(EventSys)
                        eventSys.runEvent("closeLevelUpTipDlg")
                         this.isUpgradeShow  = false;
                    }
                }
                this.isCanUse = true;
            }
        }
        else
        {
            if( this.dtType == DitieType.upgread )
            {
                 const playerPos = GlobalVar.player.node.worldPosition;
            
                // 计算playerPos与当前节点位置的距离
                const distance = Vec3.distance(playerPos, this.node.worldPosition);
                
                // 判断距离是否小于3
                if (distance > 1) {
                    var eventSys = SysMgr.getSys(EventSys)
                    eventSys.runEvent("closeLevelUpTipDlg")
                    this.isCanUse = true;
                }
                    
            }
        }
    }


    woodToDitie()
    {
        const len =  GlobalVar.player.bag1.children.length
        if( len >0 )
        {
            let woodNode = GlobalVar.player.bag1.children[len-1];
            if( this.dtID == 0 )
            {
                //提交到牛棚
                Utils.bagToDie(GlobalVar.player.node, GlobalVar.map[this.lineIndex].woodRoot, woodNode, () => {
                    //背包玉米飞到地贴
                    if(GlobalVar.player.bag1.children.length >0)    
                    {
                        GlobalVar.map[this.lineIndex].woodRoot.getComponent(Cangku).addItem( GlobalVar.woodPrefab)
                        GlobalVar.map[this.lineIndex].eat()
                        this.woodToDitie()
                        
                    }
                    else
                    {
                        this.isCanUse = true;
                    }
                })
            }
        }
        else
        {
            this.isCanUse = true;
        }
    }

    /***
     * 牛奶到地贴
     */
    milkToDitie()
    {
        const len =  GlobalVar.player.bag2.children.length
        if( len >0 )
        {
            let woodNode = GlobalVar.player.bag2.children[len-1];
            {
                //提交到牛棚
                Utils.bagToDie(GlobalVar.player.node, GlobalVar.map[this.lineIndex].milkRoot2, woodNode, () => {
                    //背包玉米飞到地贴
                    if(GlobalVar.player.bag2.children.length >0)    
                    {
                        GlobalVar.map[this.lineIndex].milkRoot2.getComponent(Cangku).addItem( GlobalVar.map[this.lineIndex].milkPrefab)
                        // GlobalVar.map.eat()
                        this.milkToDitie()
                        
                    }
                    else
                    {
                        this.isCanUse = true;
                    }
                })
            }
        }
        else
        {
            this.isCanUse = true;
        }
    }


    /***
     * 提交食物到售卖
     */
    FoodToSellPoint()
    {
        const len =  GlobalVar.player.bag3.children.length
        if( len >0 )
        {
            let woodNode = GlobalVar.player.bag3.children[len-1];
            
            this.foodToCangku(woodNode, GlobalVar.map[this.lineIndex].sellRoot, woodNode, () =>
            {
                GlobalVar.map[this.lineIndex].sellFood(woodNode);

                if(GlobalVar.player.bag3.children.length >0)    
                {
                    this.FoodToSellPoint()   
                }
                else
                {
                    this.isCanUse = true;
                }
            })
        }
        else
        {
            this.isCanUse = true;
        }
    }

    /***
     * 背包食物提交到售卖点
     */
     foodToCangku(startNode: Node, targetNode: Node, moveNode: Node, callback?) {

        let panlength = targetNode.children.length;

        let worldAngle = moveNode.worldRotation.clone();
        let worldPos = moveNode.worldPosition.clone();
        moveNode.setParent(targetNode);
        moveNode.setWorldPosition(worldPos);
        moveNode.setWorldRotation(worldAngle);

        let startPos = moveNode.position.clone();
        let toPos = v3(0, 0, 0);
        if (panlength < 3*5*10) { // 总共最多15个物品（3*5）
            
            //计算目标点
            let x = -0.5 + (panlength % 3) * 0.4; // x轴3个物品
            let y = 0 + Math.floor(panlength / 15) * 0.5; // 每层高度
            let z = 1 - Math.floor((panlength % 15) / 3) * 0.5; // z轴5个物品，每行间隔0.5

            toPos = new Vec3(x, y, z);
        }
  
        
        let tempVec3 = new Vec3();
        let controlPos = new Vec3();
        Vec3.add(controlPos, startPos, toPos);
        controlPos.multiplyScalar(.5);
        controlPos.add3f(0, 3, 0);
    
        
        tween(moveNode)
            .to(.2, { position: toPos }, {
                onUpdate: (target, ratio) => {
                    Utils.bezierCurve(ratio, startPos, controlPos, toPos, tempVec3);
                    moveNode.setPosition(tempVec3);
                }
            })
            .call(() => {
                
                callback && callback();
                // moveNode.destroy();
            })
            .start();
    }

   
}


