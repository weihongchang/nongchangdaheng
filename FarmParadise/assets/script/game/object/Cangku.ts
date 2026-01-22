import { _decorator, animation, Component, instantiate, Node, Prefab, v3, Vec3 } from 'cc';
import { GlobalVar } from '../../common/GlobalVar';
import { Utils } from '../../tools/Utils';
import { Animal } from './Animal';
const { ccclass, property } = _decorator;

@ccclass('Cangku')
export class Cangku extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }


    // 添加道具
    addItem(item: Prefab)
    {
        
        let panlength = this.node.children.length;
        if (panlength < 3*84) {
            
            let muNode = instantiate( item );
            muNode.setParent(this.node);
            //计算目标点
            let x = -0.38 + panlength % 7 * 0.13;
            let y = 0 + Math.floor(panlength / 14) * 0.1;
            let z = -0.168 + Math.floor(panlength % 14 / 7) * 0.327;

            let targetPos = new Vec3(x, y, z);
            muNode.setPosition(targetPos);
            muNode.eulerAngles = v3(0, 0, 0);
            muNode.worldScale = v3(0.8,0.8,0.8);
            // item.getComponent(Mu).isready = true;
            // AudioManager.soundPlay("addprop", 0.5);
        }
    }

    // 从仓库取出一个道具
    getItem(targetNode: Node,callback?)
    {
        let muNode = this.node.children[this.node.children.length - 1];
        if (muNode) {
            var animal = targetNode.getComponent(Animal);
            if( animal  ) 
            {
                muNode.setParent(animal.node);
                var wood = animal.node.getChildByName('Wood');
                console.log()
                Utils.NodeToPos(muNode, wood.position, true, () => {
                    callback && callback();
                    
                });
            }
        }
    }



}


