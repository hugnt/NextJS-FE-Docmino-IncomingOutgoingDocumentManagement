export type DocumentCategory = {
    id: number;
    name: string;
    code: string;
    description: string;
};

export const defaultDocumentCategory: DocumentCategory = {
    id: 0,
    name: "",
    code: "",
    description: ""
};