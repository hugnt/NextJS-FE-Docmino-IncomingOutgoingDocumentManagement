
import { httpClient } from "@/lib/httpClient";
import { DocType, DocumentFilter, DocumentNavigationOptions, ReviewerOptions } from "@/types/Document";
import { PublishDocument } from "@/types/Dossier";
import qs from "qs";

const documentRequest = {
    getNavigationOptions: (documentType?: DocType) => httpClient.get<DocumentNavigationOptions>(`documents/navigation-options${documentType?`?documentType=${documentType}`:''}`),
    getReviewerOptions: () => httpClient.get<ReviewerOptions>(`documents/reviewer-options`),
    initiateConfirmProcess: (documentId: string) => httpClient.patch(`documents/${documentId}/initiate-process`),
    getPublishDocuments: (filter?: DocumentFilter) => httpClient.get<PublishDocument[]>('documents/publish', { params: filter, paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }) }),
};

export default documentRequest;