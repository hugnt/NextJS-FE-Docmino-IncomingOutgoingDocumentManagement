
import qs from "qs";
import { httpClient } from "@/lib/httpClient";

import { ExternalDocument, ExternalDocumentDetail, ExternalDocumentFilter } from "@/types/ExternalDocument";

const externalDocumentRequest = {
    getAll: (filter?: ExternalDocumentFilter) => httpClient.get<ExternalDocument[]>('external-documents', { params: filter, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) }),
    getById: (id: string) => httpClient.get<ExternalDocumentDetail>(`external-documents/${id}`),
    addIncomingDocument: (body: FormData) => httpClient.post<string>('external-documents/incoming', body, {headers: {"Content-Type": "multipart/form-data", }}),
    updateIncomingDocument: (id: string, body: FormData) => httpClient.put(`external-documents/incoming/${id}`, body, {headers: {"Content-Type": "multipart/form-data", }}),
    addOutgoingDocument: (body: FormData) => httpClient.post<string>('external-documents/outgoing', body, {headers: {"Content-Type": "multipart/form-data", }}),
    updateOutgoingDocument: (id: string, body: FormData) => httpClient.put(`external-documents/outgoing/${id}`, body, {headers: {"Content-Type": "multipart/form-data", }}),
    delete: (id: string) => httpClient.delete(`external-documents/${id}`)
};

export default externalDocumentRequest;