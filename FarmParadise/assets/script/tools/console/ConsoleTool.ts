import { _decorator, Component, Node, native } from 'cc';
import { HttpUtils } from '../../utils/HttpUtils';

const { ccclass, property } = _decorator;

@ccclass('ConsoleTool')
export class ConsoleTool{
    static count = 0;

    static sendMsg(msg: string) {
        var time = new Date().getTime() + ConsoleTool.count;
        ConsoleTool.count++;
        var data = {
            "msg": msg,
            "time": time.toString(),
            //"path": "1111111",
            //"line": "20",
            //"funcName": "update",
            //"msgtype": "1"
        }
        HttpUtils.httpPost("http://192.168.10.26:7777/AddData", JSON.stringify(data));
    }
}

