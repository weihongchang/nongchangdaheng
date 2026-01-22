import { _decorator, Component, instantiate, Node, Prefab, tween, v3, Vec3 } from 'cc';
import { GlobalVar } from '../../common/GlobalVar';
import { Utils } from '../../tools/Utils';
import { Food } from './Food';
import { Cangku } from './Cangku';
const { ccclass, property } = _decorator;

@ccclass('Machine')
export class Machine extends Component {


    mechineStarPos = null;
    mechineMidPos = null;
    mechineEndPos = null;

    lineIndex = 0;
    start() {
        this.schedule(this.createFood, GlobalVar.machineTime);
        this.mechineStarPos = this.node.getChildByName('starPos')
        this.mechineMidPos = this.node.getChildByName('midPos')
        this.mechineEndPos = this.node.getChildByName('endPos')
    }

    update(deltaTime: number) {
        
    }

    updateMachineTime(){
        this.unschedule(this.createFood);
        this.schedule(this.createFood, GlobalVar.machineTime);
    }

    /**
     * 制造食物
     */
    createFood(){
        if(GlobalVar.map[this.lineIndex].milkRoot2 && GlobalVar.map[this.lineIndex].milkRoot2.children.length >0){
            let milk = GlobalVar.map[this.lineIndex].milkRoot2.children[ GlobalVar.map[this.lineIndex].milkRoot2.children.length-1 ];
            this.ditieToMechine(milk, GlobalVar.map[this.lineIndex].mechineNode,milk, () => {
                let food = milk.addComponent(Food);
                food.starMove(this.mechineMidPos,this.mechineEndPos, () => {
                    //食物到地贴
                    this.foodToCangku(GlobalVar.player.node, GlobalVar.map[this.lineIndex].foodRoot, food.node, () => {

                        
                    }) 
                });
            })
        }
    }



       /***
     * 牛奶从地贴飞到传送带
     */
     ditieToMechine(startNode: Node, targetNode: Node, moveNode: Node, callback?) {

        
        let worldAngle = moveNode.worldRotation.clone();
        let worldPos = moveNode.worldPosition.clone();
        moveNode.setParent(targetNode);
        moveNode.setWorldPosition(worldPos);
        moveNode.setWorldRotation(worldAngle);
        

        let startPos = moveNode.position.clone();
  
        let toPos = this.mechineStarPos.position.clone();
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

    /***
     * 加工后食物从传送带飞到仓库
     */
     foodToCangku(startNode: Node, targetNode: Node, moveNode: Node, callback?) {

        let panlength = targetNode.children.length;

        let worldAngle = moveNode.worldRotation.clone();
        let worldPos = moveNode.worldPosition.clone();
        moveNode.setParent(targetNode);
        moveNode.setWorldPosition(worldPos);
        moveNode.setWorldRotation(worldAngle);
        

        let startPos = moveNode.position.clone();
        let toPos = this.mechineStarPos.position.clone();

        
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


