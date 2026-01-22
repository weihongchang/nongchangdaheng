
import { _decorator, ProgressBar } from 'cc';
import { LodingDlg } from '../ui/LodingDlg';

const { ccclass, property } = _decorator;

@ccclass('LodingDlgCom')
export class LodingDlgCom extends LodingDlg {
    
    isloadcomplete = false;
    async initDlg(data?: any) {
        LodingDlg.prototype.initDlg.call(this, data);
        this.m_ProgressBar.getComponent(ProgressBar).progress = 0;
    }

	async refreshDlg() {

    }

    protected update(dt: number): void {
        if( this.m_ProgressBar.getComponent(ProgressBar).progress<=.8 || this.isloadcomplete)
            this.m_ProgressBar.getComponent(ProgressBar).progress += 0.01;

        if (this.m_ProgressBar.getComponent(ProgressBar).progress >= 1) {
            this.closeDlg(LodingDlgCom);
        }
    }
}
