import { httpClient } from "@/lib/httpClient";
import { ProcessDetail, RejectDocumentRequest } from "@/types/ConfirmProcess";
import { ProcessingDocument, ProcessingDocumentFilter, SignedDocument } from "@/types/Document";
import qs from "qs";


const confirmProcessRequest = {
    getUnconfirmedDocuments: (filter?: ProcessingDocumentFilter) => httpClient.get<ProcessingDocument[]>('confirm-process/documents', { params: filter, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) }),
    getUserConfirmDocument: (documentId: string) => httpClient.get<ProcessDetail | null>(`confirm-process/documents/${documentId}/user-confirm-infomation`),
    getConfirmHistory: (filter?: ProcessingDocumentFilter) => httpClient.get<SignedDocument[]>('confirm-process/history', { params: filter, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) }),
    approveDocument: (documentId: string, body: FormData) => httpClient.post(`confirm-process/documents/${documentId}/approve`, body),
    rejectDocument: (documentId: string, body: RejectDocumentRequest) => httpClient.post(`confirm-process/documents/${documentId}/reject`, body),
};

export default confirmProcessRequest;