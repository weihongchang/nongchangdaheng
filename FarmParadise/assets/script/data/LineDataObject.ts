import { _decorator, Node, __private} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LineDataObject')
export class LineDataObject{
	num: number;
	mapname: string;
	buildNum: number;
	buildID: string;
	linePosition: string;
	prefabPath: string;
}
