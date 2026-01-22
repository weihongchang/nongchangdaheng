import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Food')
export class Food extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    starMove(midpos:Node,endpos:Node,callback?)
    {
        tween(this.node)
        .to(2,{position:midpos.position})
        .call(()=>{
            //变模型
            this.node.getChildByName('naiping').active= false
            this.node.getChildByName('food').active= true
        })
        .to(2,{position:endpos.position})
        .call(()=>{
            callback && callback();
        })
        .start()
    }
}


