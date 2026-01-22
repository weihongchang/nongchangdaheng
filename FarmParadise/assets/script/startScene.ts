import { _decorator, AssetManager, assetManager, Component, director, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('startScene')
export class startScene extends Component {
    start() {

        assetManager.loadBundle("res",(err,bundle:AssetManager.Bundle)=>{
            bundle.load("prefabs/ui/LodingDlg",Prefab,(err,prefab)=>{
                console.log("prefab=======================",prefab.name);
            });
            
            director.loadScene("main");
        });
    }

    update(deltaTime: number) {
        
    }
}


