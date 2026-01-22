import { _decorator, Component, instantiate, math, Node, tween, v3, Vec3 } from 'cc';
import { GlobalVar } from '../../common/GlobalVar';
import { Utils } from '../../tools/Utils';
const { ccclass, property } = _decorator;

@ccclass('Yumi')
export class Yumi extends Component {

    isShow = true;
    start() {

    }
    

    update(deltaTime: number) {

        if( this.isShow )
        {
            this.isShow = false;
            const playerPos = GlobalVar.player.node.worldPosition;
            
            // 计算playerPos与当前节点位置的距离
            const distance = Vec3.distance(playerPos, this.node.worldPosition);
            
            // 判断距离是否小于3
            if (distance < 1) {
                // console.log("Player is within 3 units");
                // 在这里添加您的逻辑代码
                tween(this.node)
                    .to(.2, { scale: new Vec3(0, 0, 0) }) 
                    .call(() => {
                        //掉落玉米飞到背包
                        this.drop();
                    })               
                    .delay(10)
                    .to(.2, { scale: new Vec3(0.382, 0.382, 0.382) })
                    .call(() => {
                        this.isShow = true;
                    })        
                    .start();
            }
            else
            {
                this.isShow = true;
            }
        }
    }

    public drop() {
        let isaddprop = false;
        for (let index = 0; index < 5; index++) {
            let muNode = instantiate( GlobalVar.woodPrefab );
            muNode.parent = this.node.getChildByName("xgpos");
            let startPos = muNode.worldPosition.clone();
            let randomx = math.random() * 1 - 0.5;
            let randomz = math.random() * 1 - 0.5;
            muNode.setPosition(v3(randomx, 0, randomz));
            let endPos = v3(muNode.worldPosition.x, 0, muNode.worldPosition.z);

            let xgpan = GlobalVar.gameRoot;//GameGlobal.mainGame.SprListNode.getChildByName("Xiaoguo");
            muNode.parent = xgpan;
            muNode.worldPosition = startPos;
            let randomtime = 0.15 * (1+index);
            this.moveToPos_randomAngle(muNode, endPos, randomtime, () => {
                let length = GlobalVar.player.bag1.children.length - 1;
                let mupos =   new Vec3(GlobalVar.player.bag1.worldPosition.x, GlobalVar.player.bag1.worldPosition.y +0.08 * length,GlobalVar.player.bag1.worldPosition.z)//, 0.08 * length);

                // if (this.playerUUID != 0) {
                //     mupos = GameGlobal.ditieList.getChildByName("PanDiTie").worldPosition;
                //     let panNode = GameGlobal.ditieList.getChildByName("PanDiTie").getChildByName("pan");
                //     let panlength = panNode.children.length/14;
                //     if( panNode.children.length % 14 > 0 )
                //     {
                //         panlength +=1;
                //     }
                    
                //     mupos = v3(panNode.worldPosition.x, panNode.worldPosition.y +0.08 * panlength,panNode.worldPosition.z)
                // }


                tween(muNode)
                .to(0.2, { worldPosition: mupos }, {
                    onUpdate: (target, ratio) => {
                        // 使用贝塞尔曲线计算位置
                        let startPos = muNode.worldPosition.clone();
                        let endPos = mupos;
                        let controlPos = new Vec3(
                            (startPos.x + endPos.x) / 2,
                            Math.max(startPos.y, endPos.y) + 1.0, // 控制点在较高位置
                            (startPos.z + endPos.z) / 2
                        );
                        
                        let tempVec3 = new Vec3(0, 0, 0);
                        Utils.bezierCurve(ratio, startPos, controlPos, endPos, tempVec3);
                        muNode.worldPosition = tempVec3;
                    }
                })
                .call(() => {
                    muNode.destroy();
                    if (!isaddprop) {
                        isaddprop = true;
                        // if (this.playerUUID == 0) 
                        // {
                            GlobalVar.player.MoveMuTobag(0);
                        // } 
                        // else {
                        //     console.log("MoveMuTopan");
                        //     GameGlobal.actor.MoveMuTopan();
                        // }
                    }
                })
                .start();
            })
        }
    }


    //随机旋转飞行落地
    moveToPos_randomAngle(prop: Node, pos: Vec3, delay: number, callback?) {
        let startPos = prop.worldPosition.clone();
        let tempVec3 = new Vec3(0, 0, 0);
        let controlPos = pos.clone();
        Vec3.add(controlPos, startPos, pos);
        controlPos.multiplyScalar(0.5);
        let posX = math.random() * 2 - 1;
        let posZ = math.random() * 2 - 1;
        controlPos.add3f(posX, 1.2, posZ);
        let eul = math.random() * 360;

        let delay1 = math.random() *0.5 * delay;
        tween(prop)
            .to(delay, { position: pos }, {
                onUpdate: (target, ratio) => {
                    Utils.bezierCurve(ratio, startPos, controlPos, pos, tempVec3);
                    prop.worldPosition = tempVec3;
                }
            })
            .call(() => {
                // let initScale = prop.worldPosition.clone();
                // Utils.jellyEffect(prop, initScale.x, () => {

                // })
                callback && callback();
            })
            .start();
        tween(prop)
            .to(delay1, { eulerAngles: new Vec3(eul, eul, eul) })
            .start();
    }
}


