"use client"
import documentDirectoryRequest from "@/api/documentDirectoryRequest";
import storagePeriodRequest from "@/api/storagePeriodRequest";
import { DirectoryTreeItem, DirectoryType } from "@/types/DocumentDirectory";
import { Lookup } from "@/types/lookup";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type DirectoryContextType = {
    tree: DirectoryTreeItem[],
    refeshTree: () => void,
    getAllInventories: () => DirectoryTreeItem[],
    getAllShelfs: () => DirectoryTreeItem[],
    getAllBoxes: () => DirectoryTreeItem[],
    getInventory: (id: string) => DirectoryTreeItem | undefined,
    getShelf: (id: string) => DirectoryTreeItem | undefined,
    getBox: (id: string) => DirectoryTreeItem | undefined,
    loadingTree: boolean,
    storagePeriod: Lookup[],
    trackingFolder: (id: string) => DirectoryTreeItem[]
}

const DirectoryContext = createContext<DirectoryContextType>({
    tree: [],
    loadingTree: false,
    refeshTree: () => { },
    getAllInventories: () => [],
    getAllShelfs: () => [],
    getAllBoxes: () => [],
    getInventory: () => undefined,
    getShelf: () => undefined,
    getBox: () => undefined,
    storagePeriod: [],
    trackingFolder: () => []
})

export const useDirectoryContext = () => useContext(DirectoryContext);

const DirectoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tree, setTree] = useState<DirectoryTreeItem[]>([]);
    const [loadingTree, setLoadingTree] = useState(false);
    const [storagePeriod, setStoragePeriod] = useState<Lookup[]>([]);

    useEffect(() => {
        refeshTree();
        getStoragePeriod();
    }, []);

    const refeshTree = () => {
        setLoadingTree(true)
        documentDirectoryRequest.getTree().then(res => {
            setTree(res.data || []);
        }).finally(() => setLoadingTree(false))
    }

    const getStoragePeriod = () => {
        storagePeriodRequest.lookup().then(res => {
            setStoragePeriod(res.data || []);
        }).catch(err => {
            console.error("Error fetching storage periods:", err);
        });
    }

    const getAllInventories = () => {
        return tree.filter(item => item.type === DirectoryType.Inventory);
    }

    const getInventory = (id: string) => {
        return tree.find(item => item.id === id && item.type === DirectoryType.Inventory);
    }

    const getAllShelfs = () => {
        return tree.filter(item => item.type === DirectoryType.Sheft);
    }

    const getShelf = (id: string) => {
        return tree.find(item => item.id === id && item.type === DirectoryType.Sheft);
    }

    const getAllBoxes = () => {
        return tree.filter(item => item.type === DirectoryType.Box);
    }

    const getBox = (id: string) => {
        return tree.find(item => item.id === id && item.type === DirectoryType.Box);
    }

    const trackingFolder = (id: string): DirectoryTreeItem[] => {
        const item = tree.find(item => item.id === id);
        if (!item) return [];

        if (item.parentDirectoryId) {
            return [...trackingFolder(item.parentDirectoryId), item];
        } else {
            return [item];
        }
    };

    const contextValue: DirectoryContextType = {
        tree,
        loadingTree,
        refeshTree,
        getAllInventories,
        getAllShelfs,
        getAllBoxes,
        getInventory,
        getShelf,
        getBox,
        storagePeriod,
        trackingFolder

    };
    return <DirectoryContext.Provider value={contextValue}>{children}</DirectoryContext.Provider>;
}

export default DirectoryProvider;