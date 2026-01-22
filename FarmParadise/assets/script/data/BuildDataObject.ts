import { _decorator, Node, __private} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BuildDataObject')
export class BuildDataObject{
	num: number;
	buildname: string;
	buildPosition: string;
	maxNum: number;
	speed: number;
	openNeedmoney: number;
	prefabPath: string;
}
