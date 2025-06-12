import { httpClient } from "@/lib/httpClient";
import { Organization } from "@/types/Organization";
import { DataFilter } from "@/types/filter";

const organizationRequest = {
  getByFilter: (filter?: DataFilter) => httpClient.get<Organization[]>("organizations", { params: filter }),
  getById: (id: number) => httpClient.get<Organization>(`organizations/${id}`),
  create: (body: Organization) => httpClient.post("organizations", body),
  update: (id: number, body: Organization) => httpClient.put(`organizations/${id}`, body),
  delete: (id: number) => httpClient.delete(`organizations/${id}`)
};

export default organizationRequest;