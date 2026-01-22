import { _decorator, Component, Node, AudioClip } from 'cc';
import { ComBase } from '../base/ComBase';
import { SysBase } from '../base/SysBase';
import { GlobalVar } from '../common/GlobalVar';
import { HeroProp } from '../common/HeroProp';
import { ResourceLoader } from '../common/ResourceLoader';
import { SysMgr } from '../common/SysMgr';
import { PoolSys } from './PoolSys';
const { ccclass, property } = _decorator;

@ccclass('AudioSys')
export class AudioSys extends SysBase {
    audioMap = new Map<string, AudioClip>();

    wxAudioMap = new Map<string, any>();
    poolSys: PoolSys;
    onLoad() {
        this.poolSys = SysMgr.getSys(PoolSys);
    }

    async playAudio(path: string, volume?: number) {
        if (GlobalVar.isWX) {
            await this.playWXAudio(path, volume);
        } else {
            await this.playNormalAudio(path, volume);
        }
        
    }
    async playWXAudio(path: string, volume?: number) {
        var clip;
        if (!this.wxAudioMap.has(path)) {
            clip = await ResourceLoader.loadAsset<AudioClip>(path);
            this.wxAudioMap.set(path, clip);
        }
        clip = this.wxAudioMap.get(path);
        let innerAudioContext = window["wx"].createInnerAudioContext({
            useWebAudioImplement: true
 });
        innerAudioContext.src = clip.nativeUrl;
        if (volume != null)
            innerAudioContext.volume = volume;
        else
            innerAudioContext.volume = 1;
        innerAudioContext.onEnded((res) => {
            innerAudioContext.destroy();
        })
        innerAudioContext.play();
    }

    getWxAudio(url:string) {

    }

    async playNormalAudio(path: string, volume?: number) {
        if (!this.audioMap.has(path)) {
            var clip = await ResourceLoader.loadAsset<AudioClip>(path);
            this.audioMap.set(path, clip);
        }
        var audioClip = this.audioMap.get(path);
        // audioClip.playOneShot(volume);
        
    }


}

