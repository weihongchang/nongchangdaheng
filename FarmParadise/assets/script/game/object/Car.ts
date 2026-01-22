import { _decorator, Component, Node, tween } from 'cc';
import { GlobalVar } from '../../common/GlobalVar';
const { ccclass, property } = _decorator;

@ccclass('Car')
export class Car extends Component {

    @property(Node)
    huoRoot: Node = null;
    isMid = false;
    lineIndex = 0;

    start() {

    }

    update(deltaTime: number) {
        if( this.isMid )
        {
            let len = GlobalVar.map[this.lineIndex].sellRoot.children.length;
            if( len > 0  )
            {

            }
        }
    }

    
    /***
     * 移动到收货点
     */
    startMoveToMid(callback?) { 
        tween(this.node)
        .to(1, { position: GlobalVar.map[this.lineIndex].carRoot.getChildByName('carMidPoint').position }, {})
        .call(()=>{
            GlobalVar.map[this.lineIndex].car = this;
            this.isMid = true
            callback && callback();
        })
        .start()
    }

    /***
     * 收完货开走
     */
    startMoveToEnd() { 
        GlobalVar.map[this.lineIndex].car = null;
        this.isMid = false
        tween(this.node)
        .to(1, { position: GlobalVar.map[this.lineIndex].carRoot.getChildByName('carEndPoint').position }, {})
        .call(()=>{
            this.node.destroy()
        })
        .start()
    }



}


