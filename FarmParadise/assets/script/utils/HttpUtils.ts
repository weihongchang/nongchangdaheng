import { _decorator, Component, Node, loader, sys, log, CCLoader } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HttpUtils')
export class HttpUtils{
    public static async httpPost(url, parme, count: number = 3): Promise<string>{
        var result;
        for (var i = 0; i < count; i++) {
            result = await HttpUtils.post(url, parme);
            if (result != "error")
                return result;
        }
        return result;
    }

    public static async httpGet(url, count: number = 3): Promise<string> {
        var result;
        for (var i = 0; i < count; i++) {
            result = await HttpUtils.get(url);
            if (result != "error")
                return result;
        }
        return result;
    }

    public static async download(url, count: number = 3): Promise<string> {
        var result;
        for (var i = 0; i < count; i++) {
            result = await HttpUtils.down(url);
            if (result != "error")
                return result;
        }
        return result;
    }


    public static async post(url, parme): Promise<string> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var time = false;//是否超时
            var timer = setTimeout(function () {
                time = true;
                xhr.abort();//请求中止
                resolve('error');
            }, 5000);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    var respone = xhr.responseText;
                    if (time) return;//请求已经超时，忽略中止请求
                    clearTimeout(timer);//取消等待的超时
                    resolve(respone);
                }
                else if (xhr.readyState === 4 && xhr.status == 500) {
                    var respone = xhr.responseText;
                    if (time) return;//请求已经超时，忽略中止请求
                    clearTimeout(timer);//取消等待的超时
                    resolve(respone);
                }
            };

            xhr.open("POST", url, true);
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            xhr.timeout = 5000;// 5 seconds for timeout
            //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader('Content-type', 'application/json')
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
            xhr.setRequestHeader("Access-Control-Allow-Methods", "*")
            xhr.setRequestHeader("Access-Control-Allow-Headers", "Authorization, Content-Type")

            //let parme = 123;
            xhr.send(parme);
        })
    }

    public static async get(url): Promise<string> {
        return new Promise((resolve, reject) => {
            var xhr = loader.getXMLHttpRequest();
            var time = false;//是否超时
            var timer = setTimeout(function () {
                time = true;
                xhr.abort();//请求中止
                resolve('error');
            }, 5000);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    var respone = xhr.responseText;
                    if (time) return;//请求已经超时，忽略中止请求
                    clearTimeout(timer);//取消等待的超时
                    resolve(respone);
                }
            };

            xhr.open("GET", url, true);
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            xhr.timeout = 5000;// 5 seconds for timeout
            //let parme = 123;
            xhr.send();
        })
    }

    public static async down(url) {
        return new Promise((resolve, reject) => {
            var xhr = loader.getXMLHttpRequest();
            var time = false;//是否超时
            var timer = setTimeout(function () {
                time = true;
                xhr.abort();//请求中止
                resolve('error');
            }, 5000);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    var buffer = xhr.response;
                    if (time) return;//请求已经超时，忽略中止请求
                    var data = new Uint8Array(buffer);
                    clearTimeout(timer);//取消等待的超时
                    resolve(data);
                }
            };
            xhr.responseType = "arraybuffer";
            xhr.open("GET", url, true);
            // note: In Internet Explorer, the timeout property may be set only after calling the open()
            // method and before calling the send() method.
            xhr.timeout = 5000;// 5 seconds for timeout
            //let parme = 123;
            xhr.send();
        })
    }

}

