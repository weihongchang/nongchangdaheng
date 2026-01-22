import { _decorator, Component, Node, JsonAsset } from 'cc';
import { ComBase } from '../base/ComBase';
import { SysBase } from '../base/SysBase';
import { Defines } from '../common/Defines';
import { GlobalVar } from '../common/GlobalVar';
import { HeroProp } from '../common/HeroProp';
import { Misc } from '../common/Misc';
import { ResourceLoader } from '../common/ResourceLoader';
import { ResourcesPathDefine } from '../common/ResourcesPathDefine';
import { SysMgr } from '../common/SysMgr';
import { BubbleTipDlgCom } from '../dlg/dlgcom/BubbleTipDlgCom';
import { MainDlgCom } from '../dlg/dlgcom/MainDlgCom';
import { RandomUtils } from '../utils/RandomUtils';
import { StorageUtils } from '../utils/StorageUtils';
import { DlgSys } from './DlgSys';
const { ccclass, property } = _decorator;

@ccclass('HeroSys')
export class HeroSys extends SysBase {
    heroProp: HeroProp;
    onLoad() {
        this.heroProp = new HeroProp();
    }

}

