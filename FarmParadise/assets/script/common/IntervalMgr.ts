import { _decorator, Component, Node } from 'cc';
import { ComBase } from '../base/ComBase';
import { BubbleTipDlgCom } from '../dlg/dlgcom/BubbleTipDlgCom';
import { InterruptDlgCom } from '../dlg/dlgcom/InterruptDlgCom';
import { DlgSys } from '../sys/DlgSys';
import { SysMgr } from './SysMgr';
const { ccclass, property } = _decorator;

@ccclass('IntervalMgr')
export class IntervalMgr extends ComBase{
    static objMap = new Map<string, number>();

    static lockSet = new Set<string>();
    static nowTime = 0;


    static checkInterval(intervalTime=1,tip="") {

        return function (target: any, methodName: any, desc: any) {
            let originMethod: Function = desc.value;
            desc.value = async function (...args: any) {
                //args = args.map(value => String(value));
                let key = target + methodName + desc + ""
                if (!IntervalMgr.objMap.has(key)) {
                    IntervalMgr.objMap.set(key, 0);
                }
                var oldTime = IntervalMgr.objMap.get(key);
                if (IntervalMgr.nowTime - oldTime > intervalTime) {
                    IntervalMgr.objMap.set(key, IntervalMgr.nowTime);
                    await originMethod.apply(this, args);
                    return true;
                } else {
                    if (tip != "")
                        BubbleTipDlgCom.createTip(tip)
                }
            }
        }
    }

    static Lock() {

        return function (target: any, methodName: any, desc: any) {
            let originMethod: Function = desc.value;
            desc.value = async function (...args: any) {
                let key = target + methodName + desc + ""
                if (IntervalMgr.lockSet.has(key))
                    return
                IntervalMgr.lockSet.add(key)
                try {
                    await originMethod.apply(this, args);
                } catch (e) {
                    IntervalMgr.lockSet.delete(key)
                    throw e
                }
                IntervalMgr.lockSet.delete(key)

            }
        }
    }

    static Loading(tip="") {
        
        return function (target: any, methodName: any, desc: any) {
            let originMethod: Function = desc.value;
            desc.value = async function (...args: any) {
                //args = args.map(value => String(value));
                await SysMgr.getSys(DlgSys).createDlg(InterruptDlgCom, tip);
                try {
                    originMethod.apply(this, args);
                } catch (e) {
                    await SysMgr.getSys(DlgSys).closeDlg(InterruptDlgCom);
                    throw e
                }
                
                await SysMgr.getSys(DlgSys).closeDlg(InterruptDlgCom);
            }
        }
    }

    static loop(dt: number) {
        IntervalMgr.nowTime += dt;
    }
}

