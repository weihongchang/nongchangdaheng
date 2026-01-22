import { _decorator, Component, Node } from 'cc';
import { BuildDataImp } from './Data/BuildDataImp';
import { MapDataImp } from './Data/MapDataImp';
import { MapDataObject } from '../data/MapDataObject';
import { MapData } from '../data/MapData';
import { LineData } from '../data/LineData';
import { BuildData } from '../data/BuildData';
import { LineDataImp } from './Data/LineDataImp';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager  {

    //地图数据
    static maplist:MapDataImp[] = [];

    // static buildDataList: Array<BuildDataImp> = [
    //     new BuildDataImp(1, 1, 100, .3),
    //     new BuildDataImp(2, 2, 200, .4),
    //     new BuildDataImp(3, 3, 300, .3),
    //     new BuildDataImp(4, 4, 400, .6),
    //     new BuildDataImp(5, 5, 500, .8),
    //     new BuildDataImp(6, 6, 600, .4),
    // ]






    //加载数据
    static initMap() { 
        //遍历map
        for (var mapData of MapData.data) {
           
            if (Array.isArray(mapData) && mapData.length > 0) {
                const id = mapData[0];
                let mapobj = mapData[1];
                let mdImp = new  MapDataImp(mapobj)
                
                console.log('mapData:', mapobj.mapname);
                // 加载生产线数据
                let linelist = mapobj.lineID.toString().split(",")
                for( let lineID of linelist )
                {
                    //加载生产线建筑
                    let line = LineData.data.get(parseInt(lineID));
                    let ldImp = new LineDataImp(line);

                    let buildIDlist = line.buildID.toString().split(",")
                    for( let buildID of buildIDlist )
                    {
                        let build = BuildData.data.get(parseInt(buildID));
                        let buildImp = new BuildDataImp(build);
                        ldImp.buildlist.push(buildImp);
                        
                    }
                    mdImp.lineList.push(ldImp);
                }

                this.maplist.push(mdImp);


                // if (typeof firstElement === 'object' && firstElement !== null) {
                //     // 如果第一个元素是对象，则尝试转换
                //     let mapobj = firstElement as unknown as MapDataObject;
                //     console.log(mapobj.mapname);
                    
                //     // 进一步处理mapobj
                // } else {
                //     // 如果第一个元素是number或其他基本类型，需要重新考虑逻辑
                //     console.log('mapData[0] is a number:', firstElement);
                //     // 根据实际需求处理number类型的数据
                // }
            }
        }
    }


    /**
     * 根据地图ID获取地图数据
     * @param id 
     * @returns 
     */
    static getMapData(id: number) { 
        return this.maplist.find(item => item.num == id);
    }

    /**
     * 获取当前地图的所有生产线数据
     * 
     */
    static getMapLineData(id: number) { 
        let map = this.getMapData(id);
        if(map)
        {
            return map.lineList;
        }
        return [];
    }

    /**
     * 根据生产线ID获取生产线数据
     * @param id 
     * @returns 
     */
    static getLineData(id: number,mapID: number) { 
        let map = this.getMapData(mapID);
        if(map)
        {
            return map.lineList.find(item => item.num == id);
        }
        return null;
    }

    /**
     * 根据生产线获取所有建筑数据
     * 
     */
    static getLineBuildData(id: number,mapID: number) { 
        let line = this.getLineData(id,mapID);
        if(line)
        {
            return line.buildlist;
        }
        return [];
    }

    /**
     * 根据建筑ID获取建筑数据
     * @param id 
     * @returns 
     */
    static getBuildData(id: number,lineID:number,mapID: number) { 
        let line = this.getLineData(lineID,mapID);
        if(line)
        {
            return line.buildlist.find(item => item.num == id);
        }
        return null;
    }

}


