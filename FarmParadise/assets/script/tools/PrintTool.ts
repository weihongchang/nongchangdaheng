import { _decorator, Component, Node } from 'cc';
import { ConsoleTool } from './console/ConsoleTool';

const { ccclass, property } = _decorator;

@ccclass('PrintTool')
export class PrintTool {
    static logFunc;
    public static init() {
        PrintTool.logFunc = console.log;
        console.log = PrintTool.log;
    }

    static log(...data: any[]) {

        PrintTool.logFunc(...data);
        ConsoleTool.sendMsg(data.toString());
    }

}