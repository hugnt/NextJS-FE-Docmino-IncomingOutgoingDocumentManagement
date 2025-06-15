
import { httpClient } from "@/lib/httpClient";
import { DocType, PublishDocumentFilter, DocumentLookup, ReviewerLookup } from "@/types/Document";
import { PublishDocument } from "@/types/Dossier";
import qs from "qs";

const documentRequest = {
    getDocumentLookup: (documentType?: DocType) => httpClient.get<DocumentLookup>(`documents/document-lookup${documentType?`?documentType=${documentType}`:''}`),
    getReviewerLookup: () => httpClient.get<ReviewerLookup>(`documents/reviewer-lookup`),
    initiateConfirmProcess: (documentId: string) => httpClient.patch(`documents/${documentId}/initiate-process`),
    getPublishDocuments: (filter?: PublishDocumentFilter) => httpClient.get<PublishDocument[]>('documents/publish', { params: filter, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) }),
};

export default documentRequest;