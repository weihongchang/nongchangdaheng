'use strict';
const fs = require('fs');
const path = require('path');


String.prototype.replaceAll = function (search, replacement) {
	return this.replace(new RegExp(search, 'g'), replacement);
};


const FILE_TEMP = `
import { _decorator, Component, Node, Button, Label } from 'cc';
import { DlgBase } from '../../base/DlgBase';

const { ccclass, property } = _decorator;

@ccclass('%fileName%')
export class %fileName% extends DlgBase {
    public static UI_PATH: string = "%fileName%";
%nodeDefineList%
    initDlg(data?: any) {
%nodeInitList%
    }
}
`

const FILE_COM_TEMP = `
import { _decorator } from 'cc';
import { %fileName% } from '../ui/%fileName%';

const { ccclass, property } = _decorator;

@ccclass('%fileName%Com')
export class %fileName%Com extends %fileName% {
    

    async initDlg(data?: any) {
        %fileName%.prototype.initDlg.call(this, data);
    }

	async refreshDlg() {

    }
}
`



const FILE_ITEM_COM_TEMP = `
import { _decorator } from 'cc';
import { %fileName% } from '../item/%fileName%';

const { ccclass, property } = _decorator;

@ccclass('%fileName%Com')
export class %fileName%Com extends %fileName% {
    

    async initDlg(data?: any) {
        %fileName%.prototype.initDlg.call(this, data);
    }

	async refreshItem() {

    }
}
`
var NODE_DEFINE_TEMP = "\tpublic %nodeDefine%: Node;\n";
var NODE_INIT_TEMP = "\t\tthis.%nodeInit% = this.node%nodeChild%;\n";
var savePath = "";
var saveComPath = "";
var saveItemPath = "";
var saveItemComPath = "";
const handleNodeStr = async function (root, result, childNameList) {
	if (root.name.value.indexOf("Prefab") != -1)
		return;
	var childs = root.children;
	for (var child of childs) {
		var childNode = await Editor.Message.request("scene", "query-node", child.value["uuid"]);
		var childNameList2 = childNameList + '.getChildByName("' + childNode.name.value + '")'
		await handleNodeStr(childNode, result, childNameList2);
		if (!childNode.name.value.startsWith("m_"))
			continue;

		var defineName = NODE_DEFINE_TEMP.replaceAll("%nodeDefine%", childNode.name.value);
		result["nodeDefineList"] += defineName;

		var initName = NODE_INIT_TEMP.replaceAll("%nodeInit%", childNode.name.value);
		initName = initName.replaceAll("%nodeChild%", childNameList2);
		result["nodeInitList"] += initName;
	}
};

const writeFile = async function (savePath, name, txt) {
	fs.writeFile(savePath + name + ".ts", '\uFEFF' + txt, { encoding: 'utf8' }, (err) => {
		if (err) {
			console.error("保存文件失败=" + err);
		} else {
			console.log("保存成功");
		}
	});
};
module.exports = {

	load() {
		// 当 package 被正确加载的时候执行
		let dirPath = path.resolve(__dirname + "/../../")
		console.error(__dirname)
		savePath = path.join(dirPath, "./assets/script/dlg/ui/")
		saveComPath = path.join(dirPath, "./assets/script/dlg/dlgcom/")
		saveItemPath = path.join(dirPath, "./assets/script/dlg/item/")
		saveItemComPath = path.join(dirPath, "./assets/script/dlg/itemcom/")
	},

	unload() {
		// 当 package 被正确卸载的时候执行
	},

	methods: {


		async createCode() {
			const uuids = Editor.Selection.getSelected('node');
			var root = await Editor.Message.request("scene", "query-node", uuids[0]);
			var result = {
				"nodeDefineList": "",
				"nodeInitList": ""
			};

			await handleNodeStr(root, result, "");

			let newSavePath = savePath
			let newSaveComPath = saveComPath
			if (root.name.value.endsWith("Item")) {
				newSavePath = saveItemPath
				newSaveComPath = saveItemComPath
			}


			let txt = FILE_TEMP.replaceAll("%fileName%", root.name.value);
			txt = txt.replaceAll("%nodeDefineList%", result["nodeDefineList"]);
			txt = txt.replaceAll("%nodeInitList%", result["nodeInitList"]);
			await writeFile(newSavePath, root.name.value, txt);


			let fileName = newSaveComPath + root.name.value + "Com.ts";
			if (!fs.existsSync(fileName)) {
				if (root.name.value.endsWith("Item")) {
					txt = FILE_ITEM_COM_TEMP.replaceAll("%fileName%", root.name.value);
				} else {
					txt = FILE_COM_TEMP.replaceAll("%fileName%", root.name.value);
				}


				await writeFile(newSaveComPath, root.name.value + "Com", txt);
			}

		},

	}
};
