
import { httpClient } from "@/lib/httpClient";
import { DirectoryTreeItem, DocumentDirectory, DocumentDirectoryFilter } from "@/types/DocumentDirectory";



const documentDirectoryRequest = {
    getTree: () => httpClient.get<DirectoryTreeItem[]>(`document-directory/tree`),
    getByFilter: (filter?: DocumentDirectoryFilter) => httpClient.get<DocumentDirectory[]>('document-directory', { params: filter }),
    getById: (id: string) => httpClient.get<DocumentDirectory>(`document-directory/${id}`),
    create: (body: DocumentDirectory) => httpClient.post('document-directory', body),
    update: (id: string, body: DocumentDirectory) => httpClient.put(`/document-directory/${id}`, body),
    delete: (id: string) => httpClient.delete(`document-directory/${id}`)
};

export default documentDirectoryRequest;