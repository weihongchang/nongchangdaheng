import { _decorator, Component, Node, AudioClip, Game,game, sys } from 'cc';
import { SysBase } from '../base/SysBase';
import { DestroyCB } from '../common/DestroyCB';
import { Functor } from '../common/Functor';
import { GlobalVar } from '../common/GlobalVar';
import { IntervalMgr } from '../common/IntervalMgr';
const { ccclass, property } = _decorator;

@ccclass('TimeSys')
export class TimeSys extends SysBase {
    timeMap = new Map<number, Map<any, Array<any>>>();
    nowTime = 0;
    timeInterval = 1;
    keyInterval = 100;
    static OBJ_DELETE_SET_KEY = "_obj_delete_set_key";
    destroyObj = new Set<any>();
    bgWorker: Worker;
    onLoad() {
       
        //this.startWorker()


        //setInterval(async function () {
        //    await self.loop()
        //}, this.timeInterval / this.keyInterval);
       
        //this.timedCount()
       
        //timedCount();
        //game.on(Game.EVENT_HIDE, function () {
        //    console.log("enter");

        //});


        //game.on(Game.EVENT_SHOW, function () {
        //    console.log("out");
        //});
        this.schedule(this.loop, this.timeInterval / this.keyInterval);
    }
    //async update() {
    //    await this.loop()
    //}
    startWorker() {
        var self = this
        this.bgWorker = new Worker(GlobalVar.httpUrl + "/res/Worker.js");
        this.bgWorker.onmessage = async function (evt) {
            await self.loop()
        }
        postMessage(1);
    }

    //onEnterBackground() {
    //    console.log("background");
    //    if (!sys.isNative) {
    //        this.bgWorker = new Worker();
    //        this.bgWorker.onmessage = function (evt) {
    //            cc.director.mainLoop();
    //        };
    //    } else { }
    //}

    //onEnterForeground() {
    //    console.log("Foreground");

    //    if (!sys.isNative) {
    //        if (this.bgWorker != null) {
    //            this.bgWorker.terminate();
    //            this.bgWorker = null;
    //        }
    //    } else {

    //    }
    //}



    async loop() {
        this.nowTime += this.timeInterval;
        await this.runTimer();
        IntervalMgr.loop(this.timeInterval / this.keyInterval);
    }

    public addTimer(obj: any, funcName: string, dt: number, isLoop = false, ...args: any) {
        var callTime = this.nowTime + Math.round(dt * this.keyInterval);
        var objMap = this.timeMap.get(callTime);
        if (objMap == null) {
            objMap = new Map<any, Array<string>>()
            this.timeMap.set(callTime, objMap);
        }
        var funcObjArr = objMap.get(obj);
        if (funcObjArr == null) {
            funcObjArr = new Array<string>();
            objMap.set(obj, funcObjArr);
            DestroyCB.addCb(obj, this, "onObjDestroy");
        }
        funcObjArr.push({
            isLoop: isLoop,
            funcName: funcName,
            dt: dt,
            args: args
        });
        var deleteSet = obj[TimeSys.OBJ_DELETE_SET_KEY];
        if (deleteSet == null) {
            obj[TimeSys.OBJ_DELETE_SET_KEY] = new Set<string>();
        }

        obj[TimeSys.OBJ_DELETE_SET_KEY].add(callTime);
    }

    removeTimer(obj: any, funcName: string) {
        var deleteSet = obj[TimeSys.OBJ_DELETE_SET_KEY];
        if (deleteSet == null)
            return;
        for (var callTime of deleteSet) {
            var objMap = this.timeMap.get(callTime);
            if (objMap == null)
                continue;
            var funcObjArr = objMap.get(obj);
            if (funcObjArr == null)
                continue;
            var index = -1;
            for (var i in funcObjArr) {
                if (funcObjArr[i].funcName == funcName) {
                    index = Number(i);
                    break;
                }
            }
            if (index > -1) {
                funcObjArr.splice(index, 1)
            }
        }
    }

    onObjDestroy(watchDestroyObj: any) {
        this.destroyObj.add(watchDestroyObj);
        var deleteSet = watchDestroyObj[TimeSys.OBJ_DELETE_SET_KEY];
        if (deleteSet == null)
            return;
    
        for (var callTime of deleteSet) {
            var objMap = this.timeMap.get(callTime);
            if (objMap == null)
                continue;
            objMap.delete(watchDestroyObj);
        }
    }
    async runTimer() {
        var objMap = this.timeMap.get(this.nowTime);
        if (objMap == null) {
            return;
        }
        
        objMap.forEach(async (funcObjArr, obj) => {
            if (funcObjArr == null)
                return;

            for (var funcObj of funcObjArr) {
                await this.runFunc(obj,funcObj);
            }
        })
        this.timeMap.delete(this.nowTime);
    }

    async runFunc(obj, funcObj) {
        try {
            await Functor.getFunc(obj, funcObj.funcName, ...funcObj.args)();
        } catch (e) {
            throw e;
        }

        if (this.destroyObj.has(obj))
            return;
        if (obj[TimeSys.OBJ_DELETE_SET_KEY] == null)
            return;
        if (funcObj.isLoop) {
            obj[TimeSys.OBJ_DELETE_SET_KEY].delete(this.nowTime);
            this.addTimer(obj, funcObj.funcName, funcObj.dt, funcObj.isLoop, ...funcObj.args);
        }
    }
}

