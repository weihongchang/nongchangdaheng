import { _decorator, Component, Node ,native, path} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StorageUtils')
export class StorageUtils{

    public static saveWxData(key: string, data: string) {
        if (!window.window["wx"]) return;
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: key, value: data },
            ],
            success: (res) => {
                console.log("saveWxData success:res=>", res)
            },
            fail: (res) => {
                console.log("saveWxData fail:res=>", res)
            }
        })
    }


    public static getData(key: string, defaultData: string=undefined) {
        var data = localStorage.getItem(key);
        if (data == undefined || data == "" || data == null)
            return defaultData;
        return data;
    }

    public static saveData(key: string, data: string) {
        localStorage.setItem(key, data);
    }
    public static getFileData(savePath: string, defaultData: string = undefined) {
        var dir = path.dirname(savePath);

        if (!native.fileUtils.isDirectoryExist(dir)){
            return defaultData;
        }

        var data = native.fileUtils.getStringFromFile(savePath);
        if (data == undefined || data == "")
            return defaultData;
        return data;
    }

    public static saveFileData(savePath: string, data) {
        var dir = path.dirname(savePath);
        if (!native.fileUtils.isDirectoryExist(dir)) {
            native.fileUtils.createDirectory(dir);
        }
        native.fileUtils.writeDataToFile(data, savePath);
    }

    public static saveFileDataTxt(savePath: string, data: string) {
        var dir = path.dirname(savePath);
        if (!native.fileUtils.isDirectoryExist(dir)) {
            native.fileUtils.createDirectory(dir);
        }
        native.fileUtils.writeStringToFile(data, savePath);
    }


}

