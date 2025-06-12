
import { httpClient } from "@/lib/httpClient";
import qs from "qs";

import { InternalDocument, InternalDocumentDetail, InternalDocumentFilter } from "@/types/InternalDocument";

const internalDocumentRequest = {
    getAll: (filter?: InternalDocumentFilter) => httpClient.get<InternalDocument[]>('internal-documents', { params: filter, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) }),
    getById: (id: string) => httpClient.get<InternalDocumentDetail>(`internal-documents/${id}`),
    addIncomingDocument: (body: FormData) => httpClient.post<string>('internal-documents/incoming', body, {headers: {"Content-Type": "multipart/form-data", }}),
    updateIncomingDocument: (id: string, body: FormData) => httpClient.put(`internal-documents/incoming/${id}`, body, {headers: {"Content-Type": "multipart/form-data", }}),
    addOutgoingDocument: (body: FormData) => httpClient.post<string>('internal-documents/outgoing', body, {headers: {"Content-Type": "multipart/form-data", }}),
    updateOutgoingDocument: (id: string, body: FormData) => httpClient.put(`internal-documents/outgoing/${id}`, body, {headers: {"Content-Type": "multipart/form-data", }}),
    delete: (id: string) => httpClient.delete(`internal-documents/${id}`)
};

export default internalDocumentRequest;