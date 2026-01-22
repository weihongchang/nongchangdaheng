import { _decorator, Component, Node } from 'cc';
import { LineDataObject } from '../../data/LineDataObject';
import { BuildDataImp } from './BuildDataImp';
const { ccclass, property } = _decorator;

@ccclass('LineDataImp')
export class LineDataImp extends LineDataObject {
    buildlist: Array<BuildDataImp> = [];

    //当前生产线开启的建筑id
    currentBuildID: number = 0;

    constructor(ld: LineDataObject) {
        super();
        this.buildlist = [];
        this.buildID = ld.buildID;
        this.buildNum = ld.buildNum;
        this.num = ld.num;
        this.linePosition = ld.linePosition;
        
    }
}


