import { _decorator, Component, Node, js } from 'cc';


const { ccclass, property } = _decorator;
const hotfixPath = "D:/Hotfix/";
const projPath = "D:/CocosProject/cocos-creator-framework/assets/script/";
@ccclass('CodeReoladTool')
export class CodeReoladTool{
    static dict: Map<string, object> = new Map<string, object>();
    static fileSet: Set<string> = new Set<string>();
    

    static init() {
        try {
            const fs = require('fs');
            fs.watch(projPath, { recursive: true }, (event, filename) => {
                if (filename.endsWith(".ts")) {
                    this.fileSet.add(filename);
                }
            })
        } catch {

        }
        
    }

    
    static async reload() {
        console.log("----start reload---");
        for (var fileName of this.fileSet) {
            this.reloadOneFile(projPath + fileName.replace("\\", "/"));
        }
        this.fileSet.clear();
        console.log("----end reload---");
    }

    static async reloadOneFile(fileName: string) {

        console.log("reload:" + fileName);
        //var fileName = "D:/CocosProject/TestHotfix/assets/script/TTT.ts";
        fileName = fileName.replace("\\", "/");
        var modName = fileName.split("/").pop();
        modName = modName.split(".")[0];
        //var modName = fileName[fileName.lastIndexOf("/"), fileName.lastIndexOf(".")-1];
       
        const { execSync } = require('child_process');
        try {
            await execSync(`tsc --outDir "${hotfixPath}" ${fileName}`, function (error, stdout, stderr) {

            });
        } catch {

        }

        
        var oldModlue;
        if (!this.dict.has(modName))
        {
            oldModlue = js.getClassByName(modName);
            this.dict.set(modName, oldModlue)
        }
        else
            oldModlue = this.dict.get(modName);
        var filePath = hotfixPath + fileName.replace(projPath, "").replace(".ts","") + ".js";
        let moduleJs = require(filePath);

        var funcList = Reflect.ownKeys(moduleJs[modName].prototype);
 
        for (var funcKey of funcList) {
            if (funcKey.startsWith("__") || funcKey.startsWith("constructor"))
                continue;
            oldModlue.prototype[funcKey] = moduleJs[modName].prototype[funcKey];
            //oldModlue.prototype[funcKey].bind(oldModlue);
            //Object.assign(oldModlue.prototype[funcKey], moduleJs[modName].prototype[funcKey])
        }
      
        delete require.cache[require.resolve(filePath)];
    }
}

