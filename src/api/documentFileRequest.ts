
import { httpClient } from "@/lib/httpClient";

const documentFileRequest = {
    getFileUrl: (fileId: string) => httpClient.get<string>(`document-files/${fileId}`),
};

export default documentFileRequest;