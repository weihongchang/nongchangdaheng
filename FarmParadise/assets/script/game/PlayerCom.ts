import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, loader, assetManager, Texture2D, tween, Vec3, Vec2, TweenAction, Tween, SkeletalAnimation, CharacterController, instantiate, v3 } from 'cc';
import { ComBase } from '../base/ComBase';
import { HeroProp } from '../common/HeroProp';
import { Misc } from '../common/Misc';
import { ResourcesPathDefine } from '../common/ResourcesPathDefine';
import { SysMgr } from '../common/SysMgr';
import { HeroSys } from '../sys/HeroSys';
import { PredictCom } from './PredictCom';
import { GlobalVar } from '../common/GlobalVar';
import { BubbleTipDlgCom } from '../dlg/dlgcom/BubbleTipDlgCom';
import { Level } from './Level';


const { ccclass, property } = _decorator;




@ccclass('PlayerCom')
export class PlayerCom extends ComBase {

    @property(Node)
    mainNode: Node;

    @property(Node)
    bag1: Node;
    @property(Node)
    bag2: Node;
    @property(Node)
    bag3: Node;

    moveSpeed: number = 4;
    // 向量变量
    actorPos = new Vec3();
    moveDir = new Vec3();
    dir = new Vec3();
    isMoving: boolean = false;

     // 动画相关
    currAnim: string = '';

    anim: SkeletalAnimation;
    characterController: CharacterController;



    targetX = 0;
    targetY = 0;
    actionMap = new Map();
    count = 0;
    add = 0;
    moveAction: Tween<Node>;
    stopCount = 100;
    player_id;
    spriteType;
    user_name;
    act;
    heroProp: HeroProp;


    money = 0;

    protected onLoad(): void {
        
        this.characterController = this.node.getComponent(CharacterController);
        this.anim = this.mainNode.getComponent(SkeletalAnimation);
    }


    async init(player_id, sprite_type, user_name) {

        this.player_id = player_id;
        this.spriteType = sprite_type
        this.user_name = user_name
        this.addComponent(PredictCom);
        this.heroProp = SysMgr.ins.getCom(HeroSys).heroProp;
        await Misc.setSprite(this.node, ResourcesPathDefine.TEXTURES_PATH + "/pic/" + sprite_type)
    }
    async refreshPlayer(player_data) {
        if (player_data.uid != this.heroProp.uid) {
            this.moveTo(player_data.old_x / 1000, player_data.old_y / 1000, player_data.x / 1000, player_data.y / 1000, player_data.dir_x / 1000, player_data.dir_y / 1000)
        }

        if (this.spriteType != player_data.sprite_type) {
            Misc.setSprite(this.node, ResourcesPathDefine.TEXTURES_PATH + "/pic/" + player_data.sprite_type)
        }
    }


    moveTo(old_x, old_y, x, y, dir_x, dir_y, is_self = false) {
        if (this.stopCount > 10) {
            this.moveAction = tween(this.node).to(0.2, {
                position: new Vec3(x, y, 0)
            })
            this.moveAction.start()
        }

        this.getComponent(PredictCom).predict(old_x, old_y, dir_x, dir_y);
    }
    loop() {
        this.stopCount++;
        if (this.stopCount < 10) {
            return
        }
        this.getComponent(PredictCom).loop()
        this.node.angle = this.getComponent(PredictCom).nowAngle;
    }

    protected update(dt: number): void {
         if (this.isMoving ) {
            this.doMove(dt);
        }
    }
    stop(x, y) {
        this.node.position = new Vec3(x, y, 0);
        this.stopCount = 0;
        if (this.moveAction != null)
            this.moveAction.stop();
    }

    addMoney(num)
    {
        if( num>0 )
            this.money+=num;
    }

    doMove(deltaTime) {
        this.moveDir.normalize();
   
        // 创建一个平面移动方向向量，移除Y轴分量
        const planarMoveDir = new Vec3(this.moveDir.z, 0, this.moveDir.x);
        planarMoveDir.normalize();

        Vec3.multiplyScalar(this.dir, planarMoveDir, this.moveSpeed * deltaTime);
        this.dir.y = 0;

        this.characterController.move(this.dir);

        // 使用平面方向设置节点朝向，避免Y轴旋转问题
        if (planarMoveDir.lengthSqr() > 0.001) {
            this.node.forward = new Vec3(-planarMoveDir.x, -planarMoveDir.y, -planarMoveDir.z);
        }

        // this.guangQuanNode.setWorldRotationFromEuler(-45, 25, 0);
        GlobalVar.CameraControl.cameraFollow(this.node);
    }

     /**
     * 移动角色
     * @param dir 移动方向
     */
    move(dir: Vec3) {
        if (GlobalVar.cameraMoving) return;
        this.isMoving = true;
        this.moveSpeed = 3.5;

        // 直接转换向量，保留原始方向信息
        this.moveDir.set(-dir.x, dir.z, -dir.y);
        this.moveDir.normalize();


        // 播放相应动画
        
        // this.animPlay("run");
        this.animPlay("xisha");
        
    }


    /**
     * 停止移动
     */
    stopMove() {
        // GameGlobal.CameraControl.cameraChange(GameGlobal.cameraOrthoHeight, 0.3);

        this.isMoving = false;
        this.moveSpeed = 0;

        this.animPlay("idle2");
    }

    animPlay(name: string) {
        
        // console.log("播放动画", name);
        if (this.currAnim == name) return;
        this.currAnim = name;
        this.anim.crossFade(name);
    }


        //掉落的树聚集到背包
    public MoveMuTobag(bagIndex: number) {
        let addbag = () => {
            if( bagIndex == 0)
            {
                if (this.bag1.children.length <= GlobalVar.bagMax) {
                    let muNode = instantiate( GlobalVar.woodPrefab );
                    muNode.setParent(this.bag1);
                    let length = this.bag1.children.length - 1;
                    let targetPos = new Vec3(0,  .19 * length,0);
                    muNode.setPosition(targetPos);
                    muNode.eulerAngles = v3(0, 90, 0);
                    muNode.worldScale = v3(0.8,0.8,0.8);
                    // AudioManager.soundPlay("addprop", 0.5);
                    this.cleanBag();
                    this.checkBagPos();
                    // //拿到足够得钱回地贴交付
                    // if (GameGlobal.yindao.ydid == 1 && this.bag1.children.length >= 10) {
                    //     GameGlobal.yindao.ydid = 2;
                    //     GameGlobal.actor.target_YD_Node = GameGlobal.yindao.yd[0];
                    // }
                }else{
                    // this.lookMax(true);
                    BubbleTipDlgCom.createTip("背包已满") 
                    if( GlobalVar.isFirstBagMax )
                    {
                        GlobalVar.isFirstBagMax = false;
                        let carNode = GlobalVar.gameRoot.getChildByName("map1").getChildByName("line0").getChildByName("carRoot");
                        let lineNode = GlobalVar.gameRoot.getChildByName("map1").getChildByName("line0").getComponent(Level);
                        GlobalVar.gameRoot.getChildByName("map1").getChildByName("line0").getChildByName("售卖点").active =true
                        GlobalVar.CameraControl.cameraMoveTo(carNode.getChildByName('carMidPoint'),false,()=>
                        {
                            carNode.active = true;
                            lineNode.addCar(()=>{
                                lineNode.isOpenCar = true;
                                this.scheduleOnce(()=>{
                                    GlobalVar.CameraControl.cameraMoveTo(this.node,false,()=>{
                                        //摄像机回到角色
                                    }) 
                                },1)
                                 
                            });
                            
                        })
                    }
                }
            }
            else if( bagIndex == 1)
            {
                if (this.bag2.children.length <= GlobalVar.bagMax) {
                    let muNode = instantiate( GlobalVar.map[0].milkPrefab );
                    muNode.setParent(this.bag2);
                    let length = this.bag2.children.length - 1;
                    let targetPos = new Vec3(0,  .19 * length,0);
                    muNode.setPosition(targetPos);
                    muNode.eulerAngles = v3(0, 90, 0);
                    muNode.worldScale = v3(0.8,0.8,0.8);
                    // AudioManager.soundPlay("addprop", 0.5);
                    this.cleanBag();
                    this.checkBagPos();
                    
                }
            }
            else if( bagIndex == 2)
            {
                if (this.bag3.children.length <= GlobalVar.bagMax) {
                    let muNode = instantiate( GlobalVar.map[0].milkPrefab );
                    muNode.getChildByName('naiping').active= false
                    muNode.getChildByName('food').active= true
                    muNode.setParent(this.bag3);
                    let length = this.bag3.children.length - 1;
                    let targetPos = new Vec3(0,  .19 * length,0);
                    muNode.setPosition(targetPos);
                    muNode.eulerAngles = v3(0, 90, 0);
                    muNode.worldScale = v3(0.8,0.8,0.8);
                    // AudioManager.soundPlay("addprop", 0.5);
                    this.cleanBag();
                    this.checkBagPos();
                
                }
            }
        };
        this.schedule(addbag, 0.1, 1, 0);
    }


        /**
     * 刷新背包道具的位置，避免出现动画引起的道具重叠乱层
     */
    cleanBag() {
        for (let i = 0; i < this.bag1.children.length; i++) {
            let node = this.bag1.children[i];
            node.setPosition(0,  .19 * i,0)
        }
        for (let i = 0; i < this.bag2.children.length; i++) {
            let node = this.bag2.children[i];
            node.setPosition(0, 0.19 * i,0)
        }
        for (let i = 0; i < this.bag3.children.length; i++) {
            let node = this.bag3.children[i];
            node.setPosition(0, 0.19 * i,0)
        }
    }

    /**
     * 刷新背包再人物身后的位置
     */
    checkBagPos() {
        let len1 = this.bag1.children.length;
        let len2 = this.bag2.children.length;
        let len3 = this.bag3.children.length;
        if (len1 <= 0) {
            this.bag2.setPosition(0, 0, -0.4);
            if (len2 <= 0) {
                this.bag3.setPosition(0, 0, -0.4);
            } else {
                this.bag3.setPosition(0, 0, -0.7);
            }

        } else {
            this.bag2.setPosition(0, 0, -0.7);
            if (len2 <= 0) {
                this.bag3.setPosition(0, 0, -0.7);
            } else {
                this.bag3.setPosition(0, 0, -1);
            }
        }
        // MainGame.mymain.updateMoney();
    }

}

