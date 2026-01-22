import { _decorator, Component, Node } from 'cc';
import { GlobalVar } from '../../common/GlobalVar';
import { Cangku } from './Cangku';
const { ccclass, property } = _decorator;

@ccclass('Animal')
export class Animal extends Component {

    // isStart = false;

    isFlying = false;

    //吃草倒计时
    eatTime = 0;

    food= null

    lineIndex = 0;
    start() {
        this.food = this.node.getChildByName('food');
        // this.schedule(this.eatCD, GlobalVar.eatTime);
    }

    lasttime = 0;
    update(deltaTime: number) {
        //每秒执行一次
        this.lasttime += deltaTime;
        if(this.lasttime >= GlobalVar.eatTime) { 
            this.lasttime = 0;
            this.eatCD();
        }

    }

    updateEatTime() { 
        this.unschedule(this.eatCD);
        this.schedule(this.eatCD, GlobalVar.eatTime);
    }

    eatCD() { 
        if(this.eatTime > 0 )
        {
            this.eatTime -= 1;
            if( this.eatTime <= 0 )
            {
                this.food.active = false;
                GlobalVar.map[this.lineIndex].createMilk()
                GlobalVar.map[this.lineIndex].eat();
            }
        }
    }

    
}


