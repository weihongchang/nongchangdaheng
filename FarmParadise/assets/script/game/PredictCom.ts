import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode, loader, assetManager, Texture2D, tween, Vec3, Vec2, misc } from 'cc';
import { ComBase } from '../base/ComBase';
import { Misc } from '../common/Misc';


const { ccclass, property } = _decorator;

@ccclass('PredictCom')
export class PredictCom extends ComBase {
    dir = new Vec2(0,0);
    nowAngle = 0;
    maxRotSpeed = 5;
    moveSpeed = 3;
    pos = new Vec3(0, 0, 0);


    predict(old_x, old_y, dir_x, dir_y) {
        this.pos.x = old_x
        this.pos.y = old_y
        this.dir.x = dir_x
        this.dir.y = dir_y
    }

    getPos() {
        return this.pos
    }

    lookAtDir() {
        var angle = this.dir.signAngle(new Vec2(0, 1));
        var degree = angle / Math.PI * 180;
        var targetAngle = -degree;
        if (targetAngle < 0) {
            targetAngle += 360;
        }


        var rotAngle = targetAngle - this.nowAngle;
        if (Math.abs(rotAngle) > 180) {
            if (targetAngle > this.nowAngle) {
                rotAngle = -360 + rotAngle

            } else {
                rotAngle = 360 + rotAngle
            }

        }

        if (Math.abs(rotAngle) > this.maxRotSpeed) {
            if (rotAngle > 0)
                rotAngle = this.maxRotSpeed
            else
                rotAngle = -this.maxRotSpeed
        }



        var result = this.nowAngle + rotAngle
        if (result < 0) {
            result += 360;
        }
        result %= 360;
        this.nowAngle = result;

    }


    loop() {
        if (this.dir.x == 0 && this.dir.y == 0) {
            return;
        }

        this.lookAtDir()
        var pos = this.pos

        let dir = Misc.angleToDir(this.nowAngle)
        //var dir = new Vec2(Math.cos(this.nowAngle), Math.sin(this.nowAngle)).normalize();
        this.pos = new Vec3(pos.x + dir.x * this.moveSpeed, pos.y + dir.y * this.moveSpeed, 0)
    }

    getPredictDir() {
        return Misc.angleToDir(this.nowAngle)
    }

}

