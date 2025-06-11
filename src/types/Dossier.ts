import { DocType } from "./Document";
import { DataFilter } from "./filter";

export enum ContainerStatus {
    None = 0,
    Closed = 1,
    Open = 2,
    Cancel = 3,
}

export type DossierFilter = DataFilter & {
    boxId?: string | null;
}

export type Dossier = {
    id: string;
    name: string;
    code: string;
    description?: string;
    boxId: string; // Guid => string
    boxName: string;
    year: number;
    storagePeriodId: number;
    storagePeriodName: string;
    status: ContainerStatus;
    createdAt: string;
    updatedAt: string;
    documentCount: number;
};

export const defaultDossier: Dossier = {
    id: '',
    name: '',
    code: '',
    description: '',
    boxId: '',
    boxName: '',
    year: new Date().getFullYear(),
    storagePeriodId: 4,
    storagePeriodName: '',
    status: ContainerStatus.Open,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documentCount: 0
};

export type PublishDocument = {
    id: string; // Guid => string
    name?: string | null;
    codeNotation: string;
    documentRegisterName: string;
    categoryName: string;
    fieldName: string;
    documentType: DocType;
    issuedDate: string;
    publishDate: string;
};

export type DossierDetail = Dossier & {
    documents?: PublishDocument[] | null;
};