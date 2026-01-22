import { _decorator, Component, Node, Vec3, screen, tween } from 'cc';
import { GlobalVar } from '../common/GlobalVar';
import { Main } from '../Main';
const { ccclass, property } = _decorator;

@ccclass('CameraControl')
export class CameraControl extends Component {

    eulerHeng = new Vec3(-45, 45, 0);
    eulerShu = new Vec3(-46.2, 90, 0);
    offsetEul = new Vec3(0, 0, 0);
    //      43
    hengPos = new Vec3(17.45, 25, 17.5);
    shuPos = new Vec3(8, 11.6, 0);
    offsetPos = new Vec3(0, 0, 0);

    actorPos = new Vec3(0, 0, 0);
    isHeng: boolean = false;


    onLoad() {
        GlobalVar.CameraControl = this;
    }

    cameraOnLoad() {
        if (screen.windowSize.height > screen.windowSize.width && screen.windowSize.width / screen.windowSize.height < 1) {
            //竖屏
            this.isHeng = false;
            this.offsetEul.set(this.eulerShu);
            this.offsetPos.set(this.shuPos);
            // GlobalVar.mainCamera.orthoHeight = GlobalVar.cameraOrthoHeight;
            GlobalVar.mainCamera.fov = 53;
        } else {
            //横屏
            this.isHeng = true;
            this.offsetEul.set(this.eulerHeng);
            this.offsetPos.set(this.hengPos);
            // GlobalVar.mainCamera.orthoHeight = GlobalVar.cameraOrthoHeight;
            GlobalVar.mainCamera.fov = 30;
        }
        this.node.setRotationFromEuler(this.offsetEul);
        if( GlobalVar.player )
            this.cameraFollow(GlobalVar.player.node);
    }


    cameraFollow(targetNode: Node) {
        this.actorPos = targetNode.worldPosition.clone();
        let targetPos = new Vec3();
        Vec3.add(targetPos, this.actorPos, this.offsetPos);
        this.node.setPosition(targetPos);
    }


    cameraMoveTo(targetNode: Node, isGameEnd: boolean = false, callback?, isCamera = false, num?, time?, CAMtime?) {
        if (isGameEnd) {
            GlobalVar.canvas.getComponent(Main).onTouchEnd();
            GlobalVar.cameraMoving = true;
        }
        this.actorPos = targetNode.worldPosition.clone();
        let targetPos = new Vec3();
        Vec3.add(targetPos, this.actorPos, this.offsetPos);
        tween(this.node)
            .to(time ? time : 2, { position: targetPos }, { easing: "sineOut" })
            .call(() => {
                callback && callback();
            })
            .start();
        if (isCamera) {
            tween(GlobalVar.mainCamera)
                .by(CAMtime ? CAMtime : 2, { orthoHeight: num })
                .start();
        }
    }

    cameraChange(OH: number, time: number) {
        tween(GlobalVar.mainCamera)
            .to(time, { orthoHeight: OH })
            .start();
    }
    cameraUp(callback?) {
        tween(GlobalVar.mainCamera)
            .by(.5, { orthoHeight: 2.5 })
            .delay(1)
            .call(() => {
                callback && callback();
            })
            .start();
    }

}