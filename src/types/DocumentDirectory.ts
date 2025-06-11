import { DataFilter } from "./filter";

export enum DirectoryType {
    Inventory = 0,
    Sheft = 1,
    Box = 2,
}

export function getDirectoryTypeName(type: DirectoryType): string {
    switch (type) {
        case DirectoryType.Inventory:
            return 'Kho';
        case DirectoryType.Sheft:
            return 'Kệ';
        case DirectoryType.Box:
            return 'Hộp';
        default:
            return 'Không xác định';
    }
}   

export type DirectoryTreeItem = {
    id: string;
    name: string;
    parentDirectoryId?: string | null;
    type: DirectoryType;
    documentCount: number;
};

export type DocumentDirectory = {
    id: string;
    name: string;
    description?: string;
    parentDirectoryId?: string | null;
    parentDirectoryName?: string;
    type: DirectoryType;
    createdAt: string;
    documentCount?: number;
};

export const defaultDocumentDirectory: DocumentDirectory = {
    id: '',
    name: '',
    description: '',
    parentDirectoryId: null,
    parentDirectoryName: '',
    type: DirectoryType.Inventory,
    createdAt: new Date().toISOString(),
    documentCount: 0,
};

export type DocumentDirectoryFilter = DataFilter & {
    type?: DirectoryType | null;
    parentDirectoryId?: string | null;
};

export const documentDirectoryFilterDefault: DocumentDirectoryFilter = {
    pageNumber: 1,
    pageSize: 10,
    searchValue: '',
    type: null,
    parentDirectoryId: null,
}