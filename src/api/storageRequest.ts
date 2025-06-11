
import { httpClient } from "@/lib/httpClient";
import { Dossier, DossierDetail, DossierFilter } from "@/types/Dossier";

const storageRequest = {
    getByFilter: (filter?: DossierFilter) => httpClient.get<Dossier[]>('storages', { params: filter }),
    getDetail: (id: string) => httpClient.get<DossierDetail>(`storages/${id}`),
    create: (body: Dossier) => httpClient.post('storages', body),
    update: (id: string, body: Dossier) => httpClient.put(`/storages/${id}`, body),
    delete: (id: string) => httpClient.delete(`storages/${id}`),

    updateDocuments: (id: string, body: { listDocumentIds: string[] }) => httpClient.put(`/storages/${id}/documents`, body),
};

export default storageRequest;