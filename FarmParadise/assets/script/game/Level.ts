import { _decorator, Component, instantiate, math, Node, Prefab, tween, v3, Vec3 } from 'cc';
import { Niupeng } from './object/Niupeng';
import { Ditie, DitieType } from './object/Ditie';
import { Utils } from '../tools/Utils';
import { GlobalVar } from '../common/GlobalVar';
import { Cangku } from './object/Cangku';
import { Animal } from './object/Animal';
import { Car } from './object/Car';
import { EventSys } from '../sys/EventSys';
import { SysMgr } from '../common/SysMgr';
import { DlgSys } from '../sys/DlgSys';
import { BubbleTipDlgCom } from '../dlg/dlgcom/BubbleTipDlgCom';
import { Machine } from './object/Machine';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {

    @property(Niupeng)
    niupeng: Niupeng;

    @property(Node)
    dietie: Node;

    //木头堆积区
    @property(Node)
    woodRoot: Node;

    @property(Node)
    milkRoot: Node;
    @property(Node)
    milkRoot2: Node;

    @property(Node)
    foodRoot: Node;

    @property(Node)
    sellRoot: Node;

    @property(Node)
    moneyRoot: Node;

    @property(Node)
    carRoot: Node;

    @property(Node)
    mechineNode: Node;

    @property(Prefab)
    milkPrefab: Prefab;
    @property(Prefab)
    carPrefab: Prefab;
    @property(Prefab)
    moneyPrefab: Prefab;

    @property([Node])
    niu: Node[] = [];


    lineIndex: number = 0;

    //可以交付的car
    car: Car = null;

    isCarMoving: boolean = false;


    //卡车装货最大数量
    carMaxNum = 30;


    //是否在售卖货物
    isSelling: boolean = false;

    //是否解锁卡车
    isOpenCar: boolean = false;
    

    start() {
        
        this.niu = this.niupeng.node.getChildByName('牛位置').children;
        // for (let i = 0; i < this.niu.length; i++) {
        //     this.niu[i].getComponent(Animal).lineIndex = this.lineIndex
        // }
        
    }

    update(deltaTime: number) {

        if( this.car == null && !this.isCarMoving && this.isOpenCar)
        {
            this.isCarMoving = true;
            this.addCar()
        }
            
        
    }

    initLevelIndex()
    {
        // for (let i = 0; i < this.niu.length; i++) {
        //     this.niu[i].getComponent(Animal).lineIndex = this.lineIndex
        // }

        for (let i = 0; i < this.node.getComponentsInChildren(Ditie).length; i++) {
            this.node.getComponentsInChildren(Ditie)[i].lineIndex = this.lineIndex
        }

        for (let i = 0; i < this.node.getComponentsInChildren(Animal).length; i++) {
            this.node.getComponentsInChildren(Animal)[i].lineIndex = this.lineIndex
        }

        for (let i = 0; i < this.node.getComponentsInChildren(Machine).length; i++) {
            this.node.getComponentsInChildren(Machine)[i].lineIndex = this.lineIndex
        }

    }


    addCar(callback?)
    {
        let carnode =  instantiate(this.carPrefab)
        carnode.getComponent(Car).lineIndex = this.lineIndex;
        carnode.setPosition( this.carRoot.getChildByName('carStarPoint').position);

        carnode.parent = this.carRoot;
        
        carnode.getComponent(Car).startMoveToMid(() =>{
            this.isCarMoving = false;
            callback && callback();
            //自动装货
            this.sellFoodAuto()

        } )
    }
    

    //根据类型获取地贴
    getDitie(type: DitieType) { 
        for (let index = 0; index < this.dietie.children.length; index++) {
            let dt = this.dietie.children[index].getComponent(Ditie);
            if (dt.dtType == type) {
                return dt;
            }
            
        }
    }


    currentAnimalIndex=0;
    /**
     * 牛吃草
     */
    eat()
    {
        if(  GlobalVar.map[this.lineIndex].woodRoot.children.length > 0 )
        {
            //for (let index = 0; index < this.niu.length; index++) 
            {
                
                let animal = this.niu[this.currentAnimalIndex].getComponent(Animal);
                if( animal.eatTime <= 0 )
                {
                    let wood = animal.node.getChildByName('food');
                
                    animal.eatTime = 10;        

                    let muNode = GlobalVar.map[this.lineIndex].woodRoot.children[GlobalVar.map[this.lineIndex].woodRoot.children.length - 1];
                    
                    Utils.bagToDie(muNode, animal.node, muNode, () => {
                        wood.active = true
                
                    });
                }
                    
            }
            this.currentAnimalIndex++;
            if( this.currentAnimalIndex >= this.niu.length )
            {
                this.currentAnimalIndex = 0;
            }
        }
    }


    mildindex = 0;

    /**
     * 创建牛奶
     */
    createMilk() {
        var milk = instantiate(this.milkPrefab);
        this.milkRoot.addChild(milk);
        if( this.mildindex >= this.niu.length )
        {
            this.mildindex = 0;
        }

        milk.setWorldPosition(this.niu[this.mildindex].worldPosition);
        this.mildindex++;
        
        //x随机正负1
        var x = Math.random() * 2 - 1;
        var z = Math.random() * 2 - 1;

        Utils.NodeToPos(milk, v3(x,0,z), false, () => {
            //牛奶飞到地板
            
        })
    }

    /**
     * 从牛棚获取奶瓶
     */
    milkTobagFromNiupeng(callback?)
    {
        if(this.milkRoot.children.length > 0 )
        {
            if (GlobalVar.player.bag2.children.length <= GlobalVar.bagMax) 
            {
                let milk = this.milkRoot.children[this.milkRoot.children.length - 1];

                Utils.bagToDie(milk, GlobalVar.player.bag2, milk, () => {
                    GlobalVar.player.MoveMuTobag(1);
                    callback && callback();
                })
            }
        }
        else
        {
            callback && callback();
        }
        
    }

    isAddmoney = false
    /**
     * 收取money
     */
    shouMoney(callback?)
    {
        if(this.moneyRoot.children.length > 0 )
        {
            // GlobalVar.player.addMoney(100)
            this.giveMoney( (addNum) => { 
                GlobalVar.player.addMoney(addNum)
                BubbleTipDlgCom.createTip("获得"+addNum+"元") 
                var eventSys = SysMgr.getSys(EventSys)
                eventSys.runEvent("refreshMoney")
                callback && callback();
            } );
        }
        else
        {
            callback && callback();
        }
        
    }

     giveMoney(callback?){

        // this.startPos = new Vec3(0.005, 0.147, 0.71);
        let moneyNum = this.moneyRoot.children.length+1;
        let completeNum = this.moneyRoot.children.length;
        let addMoneyNmu =completeNum * 10;

        for(let i = 0; i < this.moneyRoot.children.length; i++){
            moneyNum--;
            this.scheduleOnce(()=>{
                let coin = this.moneyRoot.children[this.moneyRoot.children.length-1];
                coin.setParent(GlobalVar.player.node);
                
                let groupIndex = moneyNum % 6;
                let posX = groupIndex < 3 ? -0.095 : 0.098;
                let posZ = [-0.111, 0.013, 0.128][groupIndex % 3];
                let posY = Math.floor(moneyNum / 6) * 1;
                let pos = new Vec3(posX, posY, posZ);
                
                
                this.moveToPos4(coin,pos, 0.6, ()=>{
                    coin.destroy();
                    completeNum --;
                    if(completeNum <= 0)
                    {
                        callback && callback(addMoneyNmu);
                    }
                })
                },0.005 * i)
            }
    }


    moveToPos4(money:Node,pos: Vec3, delay: number, callback?) {
        let startPos = money.position.clone();
        startPos = new Vec3(startPos.x, startPos.y + 0.3, startPos.z);

        let tempVec3 = new Vec3(0, 0, 0);
        let controlPos = pos.clone();
        controlPos = new Vec3((pos.x + startPos.x) * 0.5, (pos.y + startPos.y) * 0.5 + 1, (pos.z + startPos.z) * 0.5);
        let posX = math.random() * 2 - 1;
        let posZ = math.random() * 2 - 1;
        controlPos.add3f(posX, 1, posZ);
        let eul = math.random() * 360;
        tween(money)
            .to(delay, { position: pos }, {
                onUpdate: (target, ratio) => {
                    Utils.bezierCurve(ratio, startPos, controlPos, pos, tempVec3);
                    money.setPosition(tempVec3);
                }
            })
            .call(() => {
                
                let initScale = money.scale.clone();
                this.jellyEffect(money, initScale.x, () => {
                    money.setScale(initScale);
                })
                callback && callback();
            })
            .start();
        
        tween(money)
            .to(delay, { eulerAngles: new Vec3(eul, eul, eul) })
            .call(()=>{
                money.setRotationFromEuler(0,0,0);
            })
            .start();

    }

    jellyEffect(node: Node, t, callback?) {
        node.setScale(Vec3.ZERO);
        tween(node)
            .to(0.15, { scale: v3(1 * t, 1 * t, 1 * t) })
            .to(.06, { scale: v3(1.4 * t, 0.53 * t, 1.4 * t) })
            .to(.12, { scale: v3(0.8 * t, 1.2 * t, 0.8 * t) })
            .to(.07, { scale: v3(1.2 * t, 0.7 * t, 1.2 * t) })
            .to(.07, { scale: v3(0.85 * t, 1.1 * t, 0.85 * t) })
            .to(.07, { scale: v3(1 * t, 1 * t, 1 * t) })
            .call(() => {
                callback && callback();
            })
            .start();
    }

    foodTobag(callback?)
    {
        if(this.foodRoot.children.length > 0 )
        {
            if (GlobalVar.player.bag3.children.length <= GlobalVar.bagMax) 
            {
                let milk = this.foodRoot.children[this.foodRoot.children.length - 1];

                Utils.bagToDie(milk, GlobalVar.player.bag3, milk, () => {
                    GlobalVar.player.MoveMuTobag(2);
                    callback && callback();
                })
            }
            else
            {
                BubbleTipDlgCom.createTip("背包已满") 
            
            }
        }
        else
        {
            callback && callback();
        }
        
    }

    /**
     * 卖食物
     */
    sellFood(foodNode: Node, callback?) { 
        if(this.car != null && !this.isCarMoving)
        {
            if(this.car.getComponent(Car).huoRoot.children.length >= this.carMaxNum)
            {

            }
            else
            {
                this.foodToCar(null,this.car.huoRoot, foodNode, () => {
                    //增加钱
                    this.addMoney(10,foodNode.worldPosition.clone());
                    if(this.car.getComponent(Car).huoRoot.children.length >= this.carMaxNum)
                    {
                        this.car.getComponent(Car).startMoveToEnd();
                    }
                })
            }
        }
    }


    sellFoodAuto() { 
        if(GlobalVar.player.bag3.children.length <= 0)
        {
            if(this.car != null && !this.isCarMoving)
            {
                if(this.car.getComponent(Car).huoRoot.children.length >= this.carMaxNum)
                {

                }
                else
                {
                    if( this.sellRoot.children.length > 0 )
                    {
                        let foodNode = this.sellRoot.children[this.sellRoot.children.length-1];
                        this.foodToCar(null,this.car.huoRoot, foodNode, () => {
                            //增加钱
                            this.addMoney(10,foodNode.worldPosition.clone());
                            if(this.car.getComponent(Car).huoRoot.children.length >= this.carMaxNum)
                            {
                                this.car.getComponent(Car).startMoveToEnd();
                            }
                            else
                            {
                                this.sellFoodAuto();
                            }

                        })
                    }
                }
            }
        }
    }

    /**
     * 增加钱
     * 数字兑换模型10：1   
     * 10元兑换1捆纸币
     * @param num 
     */
    addMoney(num,starPos?) { 

        let moneyNode = instantiate(this.moneyPrefab);
        moneyNode.setWorldPosition(starPos);
        this.foodToCar(null,this.moneyRoot, moneyNode, () => {
            //增加钱
            // this.addMoney(10);
        })
    }


    /***
     * 食物到卡车
     */
     foodToCar(startNode: Node, targetNode: Node, moveNode: Node, callback?) {

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


