import { _decorator, Component, Node } from 'cc';
import { MapDataObject } from '../../data/MapDataObject';
import { LineDataImp } from './LineDataImp';
const { ccclass, property } = _decorator;

@ccclass('MapDataImp')
export class MapDataImp extends MapDataObject {
    lineList: Array<LineDataImp> = [];

    //当前地图开启的生产线
    currentLineID:number = 0;

    constructor(md: MapDataObject) {
        super();
        this.line = md.line
        this.lineID = md.lineID
        this.mapname =  md.mapname
        this.num = md.num;
    }

}


