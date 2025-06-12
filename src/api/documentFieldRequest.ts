import { httpClient } from "@/lib/httpClient";
import { DocumentField } from "@/types/DocumentField";
import { DataFilter } from "@/types/filter";

const documentFieldRequest = {
    getByFilter: (filter?: DataFilter) => httpClient.get<DocumentField[]>('document-fields', { params: filter }),
    getById: (id: number) => httpClient.get<DocumentField>(`document-fields/${id}`),
    create: (body: DocumentField) => httpClient.post('document-fields', body),
    update: (id: number, body: DocumentField) => httpClient.put(`/document-fields/${id}`, body),
    delete: (id: number) => httpClient.delete(`document-fields/${id}`)
};

export default documentFieldRequest;