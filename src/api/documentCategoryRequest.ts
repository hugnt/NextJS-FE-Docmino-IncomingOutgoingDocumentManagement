
import { httpClient } from "@/lib/httpClient";
import { DocumentCategory } from "@/types/DocumentCategory";
import { DataFilter } from "@/types/filter";

const documentCategoryRequest = {
    getByFilter: (filter?: DataFilter) => httpClient.get<DocumentCategory[]>('document-categories', { params: filter }),
    getById: (id: number) => httpClient.get<DocumentCategory>(`document-categories/${id}`),
    create: (body: DocumentCategory) => httpClient.post('document-categories', body),
    update: (id: number, body: DocumentCategory) => httpClient.put(`/document-categories/${id}`, body),
    delete: (id: number) => httpClient.delete(`document-categories/${id}`)
};

export default documentCategoryRequest;