import { _decorator, Component, Node , native, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TweenAction')
export class TweenAction {
    data: any;
    constructor(data) {
        this.data = data;
    }

    static createStart(): TweenAction {
        var data =  new TweenAction({
            type: 0,
            next: null
        })

        TweenAction.actionSet.add(data)
        return data;
    }

    static actionSet = new Set<TweenAction>();
    static delSet = new Set<TweenAction>();
    static addSet = new Set<TweenAction>();
    moveTo(obj: Node, startPos: Vec3, pos: Vec3, delay: number, cb: Function): TweenAction {
        var data = new TweenAction({
            obj: obj,
            type: 1,
            delay: delay,
            dirSpeed: new Vec3(pos).subtract(startPos).multiplyScalar(1 / delay),
            time: 0,
            cb: cb,
            next: null
        })
        this.data.next = data;
        return data;
    }
    delay(delay: number, cb: Function): TweenAction {
        var data = new TweenAction({
            type: 2,
            delay: delay,
            time: 0,
            cb: cb,
            next: null
        })
        this.data.next = data;
        return data;
    }


    static loop(dt) {
        TweenAction.delSet.clear();
        TweenAction.addSet.clear();
        for (var action of TweenAction.actionSet) {
            TweenAction.runAction(dt, action);
        }
        for (var action of TweenAction.addSet) {
            TweenAction.actionSet.add(action);
        }
        for (var action of TweenAction.delSet) {
            TweenAction.actionSet.delete(action);
        }

    }


    static runAction(dt: number, action: TweenAction) {
        var data = action.data;
        if (data.type == 0) {
            TweenAction.runNextAction(dt, action);
        }
        else if (data.type == 1) {
            TweenAction.handleMove(dt, action);
        }
        else if (data.type == 2) {
            TweenAction.handleDelay(dt, action);
        }
    }

    static handleMove(dt: number, action: TweenAction) {
        var data = action.data;
        if (!data.obj.activeInHierarchy) {
            TweenAction.runNextAction(dt, action);
            return;
        }
 
        data.time += dt;
        data.obj.position = data.obj.position.add(new Vec3(data.dirSpeed).multiplyScalar(dt))
        if (data.time >= data.delay) {
            TweenAction.runNextAction(dt, action);
            if (data.cb != null)
                data.cb();
        }
    }

    static handleDelay(dt: number, action: TweenAction) {
        var data = action.data;
        data.time += dt;
        if (data.time >= data.delay) {
            TweenAction.runNextAction(dt, action);
            if (data.cb != null)
                data.cb();
        }
    }

    static runNextAction(dt: number, action: TweenAction) {
        var nextAction = action.data.next;
        TweenAction.delSet.add(action);
        if (nextAction == null) {
            return;
        }
        TweenAction.runAction(dt, nextAction)
        TweenAction.addSet.add(nextAction);
        
    }








    //static objMap = new Map<Node, any>();
    //static moveTo(obj: Node, pos: Vec3, delay: number, cb: Function): TweenAction {
    //    this.objMap.set(obj, {
    //        type: 1,
    //        delay: delay,
    //        dirSpeed: new Vec3(pos).subtract(obj.position).multiplyScalar(1 / delay),
    //        time: 0,
    //        cb: cb
    //    })
    //    return TweenAction;
    //}
    //static delay(obj: Node, delay: number, cb: Function): TweenAction {
    //    this.objMap.set(obj, {
    //        type: 2,
    //        delay: delay,
    //        time: 0,
    //        cb: cb
    //    })
    //    return TweenAction;
    //}


    //static async loop(dt) {
    //    var delSet = new Set<Node>();
    //    for (var obj of TweenAction.objMap.keys()) {
    //        if (!obj.activeInHierarchy)
    //            continue
    //        var data = TweenAction.objMap.get(obj);
    //        if (data.type == 1)
    //            TweenAction.handleMove(dt, obj, data, delSet);
    //        else if (data.type == 2)
    //            TweenAction.handleDelay(dt, obj, data, delSet);
    //    }
    //    for (var obj of delSet) {
    //        TweenAction.objMap.delete(obj);
    //    }
    //}

    //static handleMove(dt: number, obj: Node, data: any, delSet: Set<Node>) {
    //    data.time += dt;
    //    obj.position = obj.position.add(new Vec3(data.dirSpeed).multiplyScalar(dt))

    //    if (data.time > data.delay) {
    //        delSet.add(obj);
    //        if (data.cb != null)
    //            data.cb();
    //    }
    //}

    //static handleDelay(dt: number, obj: Node, data: any, delSet: Set<Node>) {
    //    data.time += dt;
    //    if (data.time > data.delay) {
    //        delSet.add(obj);
    //        if (data.cb != null)
    //            data.cb();
    //    }
    //}

}

