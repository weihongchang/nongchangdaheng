import { _decorator, Node, __private} from 'cc';
import { MapDataObject } from './MapDataObject';
const { ccclass, property } = _decorator;

@ccclass('MapData')
export class MapData{
	static data: Map<number, MapDataObject> = new Map([
		[0, {
			num: 0,
			mapname: "地图1",
			line: 5,
			lineID: "0,1,2,3,4",
		}],
		[1, {
			num: 1,
			mapname: "地图2",
			line: 5,
			lineID: "5,6,7,8,9",
		}],
		[2, {
			num: 2,
			mapname: "地图3",
			line: 5,
			lineID: "10,11,12,13,14",
		}],
	])
}
