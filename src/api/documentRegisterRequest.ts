import { httpClient } from "@/lib/httpClient";
import { DocumentRegister } from "@/types/DocumentRegister";
import { DataFilter } from "@/types/filter";

const documentRegisterRequest = {
  getByFilter: (filter?: DataFilter) => httpClient.get<DocumentRegister[]>("document-registers", { params: filter }),
  getById: (id: string) => httpClient.get<DocumentRegister>(`document-registers/${id}`),
  create: (body: DocumentRegister) => httpClient.post("document-registers", body),
  update: (id: string, body: DocumentRegister) => httpClient.put(`document-registers/${id}`, body),
  delete: (id: string) => httpClient.delete(`document-registers/${id}`)
};

export default documentRegisterRequest;