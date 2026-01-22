import { _decorator, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

export enum WorkerState {
    //采集
    COLLECT,
    //出售
    SELL,
    //停止
    STOP,
    //等待
    WAIT,
    //移动
    MOVE,
    //采集完成
    COLLECT_FINISH,
    //出售完成
    SELL_FINISH,
    //等待完成
    WAIT_FINISH,
    //移动完成
    MOVE_FINISH,
    //提交
    PUT,

}

@ccclass('Worker')
export class Worker extends Component {


    @property(Node)
    mainNode: Node = null;

    @property(Node)
    getNode: Node = null;

    @property(Node)
    putNode: Node = null;

    @property(Node)
    bagNode: Node = null;

    bagNum: number = 10; //背包数量

    // 动画相关
    currAnim: string = '';

    anim: SkeletalAnimation;

    //移动速度
    moveSpeed: number = 1;
    
    //工作流
    workflow:WorkerState[] = [];

    currentState: WorkerState = WorkerState.WAIT;



    /////////////////////状态//////////////////////////////
    isCollecting: boolean = false;

    /////////////////////状态//////////////////////////////

    start() {
        this.anim = this.mainNode.getComponent(SkeletalAnimation);
        this.workflow = [WorkerState.COLLECT,WorkerState.MOVE,WorkerState.PUT];

        this.scheduleOnce(()=>{
            this.nextState();
        },0.5)
    }

    update(deltaTime: number) {
        switch (this.currentState) {
            case WorkerState.WAIT:
                break;
            case WorkerState.COLLECT:
                if(!this.isCollecting)
                {
                    this.isCollecting = true;
                    this.doCollect();
                }
                break;
            case WorkerState.MOVE:
                break;
            case WorkerState.PUT:
                break;
        }
    }

    nextState(){
        let index = this.workflow.indexOf(this.currentState);
        if(index == -1){
            this.currentState = this.workflow[0];
        }else{
            index++;
            if(index >= this.workflow.length){
                index = 0;
            }
            this.currentState = this.workflow[index];
        }
    }
        // this.currentState = this.workflow[this.workflow.indexOf(this.currentState)+1];
    // }
    

    /**
     * 采集
     */
    doCollect(){
        if( this.bagNode.children.length >= this.bagNum)
        {
            this.isCollecting
        }
    }

    /**
     * 移动
     */
    doMove(){

    }

    /**
     * 提交
     */
    doPut(){

    }



    animPlay(name: string) {
        
        // console.log("播放动画", name);
        if (this.currAnim == name) return;
        this.currAnim = name;
        this.anim.crossFade(name);
    }
}


