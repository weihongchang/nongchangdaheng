import { _decorator, Component, Node, Asset, loader, instantiate, Prefab, resources, assetManager, sys, SpriteFrame, AssetManager } from 'cc';
import { ResourcesObjBase } from '../base/ResourcesObjBase';
import { DestroyCB } from './DestroyCB';
const { ccclass, property } = _decorator;



@ccclass('ResourceLoader')
export class ResourceLoader{
    static pathAssetMap = new Map;//·����Ӧ��Դ
    static objPathMap = new Map;//ʵ������Դ��Ӧ·��
    static assetRefMap = new Map;//·����Ӧ���ü���
    public static async loadAsset<T extends Asset>(path): Promise<T> {

        return await new Promise((resolve, reject) => {
            var asset = ResourceLoader.pathAssetMap.get(path);
            if (asset != undefined) {//asset�Ѿ�������
                ResourceLoader.assetRefMap.set(path, ResourceLoader.assetRefMap.get(path) + 1);
                return resolve(asset);
            }

            assetManager.loadBundle("res",(err,bundle:AssetManager.Bundle)=>{
                        // bundle.load("prefabs/ui/LodingDlg",Prefab,(err,prefab)=>{
                        //     console.log("prefab=======================",prefab.name);
                        // });
                        bundle.load(path,(err,newAsset)=>{
                            
                            if (newAsset == null)
                                return resolve(newAsset as T);
                            newAsset.addRef();
                            ResourceLoader.pathAssetMap.set(path, newAsset);
                            if (!ResourceLoader.assetRefMap.has(path))
                                ResourceLoader.assetRefMap.set(path, 1);
                            else
                                ResourceLoader.assetRefMap.set(path, ResourceLoader.assetRefMap.get(path) + 1);
                            return resolve(newAsset as T);
                        });
                        
            });

            // loader.loadRes<T>(path, function (err, newAsset) {
            //     //newAsset["_asset_path"] = path;
            //     //newAsset.addRef();
            //     if (newAsset == null)
            //         return resolve(newAsset);
            //     newAsset.addRef();//���ӵĻ� ��ʱ���л��������Զ����ͷ�
            //     ResourceLoader.pathAssetMap.set(path, newAsset);
            //     if (!ResourceLoader.assetRefMap.has(path))
            //         ResourceLoader.assetRefMap.set(path, 1);
            //     else
            //         ResourceLoader.assetRefMap.set(path, ResourceLoader.assetRefMap.get(path) + 1);
            //     return resolve(newAsset);
            // });
        })

    }

    /***
     * 加载资源列表
     */
   public static async loadAssetList<T extends Asset>(paths: string[]): Promise<T[]> {
        return await new Promise(async (resolve, reject) => {
            // 检查是否有缓存资源
            const cachedAssets: T[] = [];
            let hasCached = false;
            
            for (const path of paths) {
                const cachedAsset = ResourceLoader.pathAssetMap.get(path) as T;
                if (cachedAsset) {
                    cachedAssets.push(cachedAsset);
                    ResourceLoader.assetRefMap.set(path, ResourceLoader.assetRefMap.get(path) + 1);
                    hasCached = true;
                } else {
                    cachedAssets.push(null); // 占位符
                }
            }
            
            // 如果全部资源都有缓存，直接返回
            if (hasCached && cachedAssets.indexOf(null) === -1) {
                return resolve(cachedAssets);
            }

            try {
                assetManager.loadBundle("res", (err, bundle: AssetManager.Bundle) => {
                    if (err) {
                        console.error("Failed to load bundle:", err);
                        reject(err);
                        return;
                    }

                    bundle.load(paths, (err: Error, assets: Asset[]) => {
                        if (err) {
                            console.error("Failed to load assets:", err);
                            reject(err);
                            return;
                        }

                        for (let i = 0; i < paths.length; i++) {
                            const path = paths[i];
                            const asset = assets[i];
                            
                            if (asset == null) {
                                console.warn(`Asset not found: ${path}`);
                                continue;
                            }

                            // 检查是否已经缓存
                            if (!ResourceLoader.pathAssetMap.has(path)) {
                                asset.addRef();
                                ResourceLoader.pathAssetMap.set(path, asset);
                                ResourceLoader.assetRefMap.set(path, 1);
                            } else {
                                // 如果已存在，增加引用计数
                                ResourceLoader.assetRefMap.set(path, ResourceLoader.assetRefMap.get(path) + 1);
                            }
                            
                            // 替换缓存中的占位符
                            if (cachedAssets[i] === null) {
                                cachedAssets[i] = asset as T;
                            }
                        }

                        resolve(cachedAssets as T[]);
                    });
                });
            } catch (error) {
                console.error("Exception during asset loading:", error);
                reject(error);
            }
        });
    }

    public static releaseAsses(path: string) {
        if (!ResourceLoader.assetRefMap.has(path))
            return;
        var refCount = ResourceLoader.assetRefMap.get(path);
        refCount -= 1;
        ResourceLoader.assetRefMap.set(path, refCount);
        if (refCount == 0) {
            var asset: Asset = ResourceLoader.pathAssetMap.get(path);
            asset.decRef();
            ResourceLoader.pathAssetMap.delete(path);
            ResourceLoader.assetRefMap.delete(path);
            loader.release(asset);
        }
    }

    public static async insNode(path): Promise<Node> {
        var newAsst = await ResourceLoader.loadAsset<Prefab>(path);
        return await new Promise((resolve, reject) => {
            var newObj = instantiate(newAsst);
            ResourceLoader.objPathMap.set(newObj, path);
            var com = newObj.addComponent(ResourcesObjBase);
            DestroyCB.addCb(com, this, "_destroyNode")
            return resolve(newObj);
        })

    }

    public static _destroyNode(watchDestroyObj: ResourcesObjBase) {
        var obj = watchDestroyObj.node;
        if (!ResourceLoader.objPathMap.has(obj)) {
            return;
        }
        var path = ResourceLoader.objPathMap.get(obj);
        ResourceLoader.objPathMap.delete(obj);
        ResourceLoader.releaseAsses(path);
    }

}

