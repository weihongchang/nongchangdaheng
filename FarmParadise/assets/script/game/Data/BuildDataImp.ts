import { _decorator, Component, Node } from 'cc';
import { BuildDataObject } from '../../data/BuildDataObject';
const { ccclass, property } = _decorator;

@ccclass('BuildDataImp')
export class BuildDataImp extends BuildDataObject  {
    
    
    public buildID = 0;
    public level = 0;
    public needMoney = 101;
    public currentMoney=0;
    public press = .3;

    //是否已开启
    public isOpen = this.currentMoney >= this.needMoney;

    constructor(buildData: BuildDataObject) {
        super();
        this.num = buildData.num
        this.buildname = buildData.buildname
        this.buildPosition = buildData.buildPosition
        this.maxNum = buildData.maxNum
        this.speed = buildData.speed
        this.openNeedmoney = buildData.openNeedmoney
        this.prefabPath = buildData.prefabPath
    }
    // constructor(id: number, level: number, needmoney: number, probability: number) {
    //     super();
    //     this.buildID = id;
    //     this.level = level;
    //     this.needMoney = needmoney;
    //     this.press = probability;
    // }
}


