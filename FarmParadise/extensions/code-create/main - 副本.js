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
var NODE_DEFINE_TEMP = "\tpublic %nodeDefine%: Node;\n";
var NODE_INIT_TEMP = "\t\tthis.%nodeInit% = this.node%nodeChild%;\n";
var savePath = "D:/Ku/Ku/KuClient/assets/script/dlg/ui/";
const handleNodeStr = async function (root, result, childNameList) {
	var childs = root.children;
	for (var child of childs) {
		var childNode = await Editor.Message.request("scene", "query-node", child.value["uuid"]);
		var childNameList2 = childNameList+'.getChildByName("' + childNode.name.value + '")'
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

const writeFile = async function (name, txt) {
	fs.writeFile(savePath + name + ".ts", txt, (err) => {
		if (err) {
			console.error("保存文件失败=" + err);
		} else {
			console.log("保存成功");
        }
	});
};
module.exports = {

	load () {
		// 当 package 被正确加载的时候执行
	},

	unload () {
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

			await handleNodeStr(root, result,"");
			
			var txt = FILE_TEMP.replaceAll("%fileName%", root.name.value);
			txt = txt.replaceAll("%nodeDefineList%", result["nodeDefineList"]);
			txt = txt.replaceAll("%nodeInitList%", result["nodeInitList"]);
			await writeFile(root.name.value,txt);
		},
		
	}
};
