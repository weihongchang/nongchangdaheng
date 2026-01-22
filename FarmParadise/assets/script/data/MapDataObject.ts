import { _decorator, Node, __private} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapDataObject')
export class MapDataObject{
	num: number;
	mapname: string;
	line: number;
	lineID: string;
}
