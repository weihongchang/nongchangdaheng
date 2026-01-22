import { _decorator, Component, Node, Animation, __private, Vec3, ProgressBar, tween } from 'cc';
import { PoolSys } from '../sys/PoolSys';
import { SysMgr } from './SysMgr';


const { ccclass, property } = _decorator;

@ccclass('DestroySelf')
export class DestroySelf extends Component {
    destroySelf() {
        this.node.getComponent(Animation).stop();
        SysMgr.getSys(PoolSys).destroyNode(this.node);
    }

}

