import { httpClient } from "@/lib/httpClient";
import { Group } from "@/types/Group";
import { DataFilter } from "@/types/filter";

const groupRequest = {
    getByFilter: (filter?: DataFilter) => httpClient.get<Group[]>("groups", { params: filter }),
    getById: (id: string) => httpClient.get<Group>(`groups/${id}`),
    create: (body: Group) => httpClient.post("groups", body),
    update: (id: string, body: Group) => httpClient.put(`groups/${id}`, body),
    delete: (id: string) => httpClient.delete(`groups/${id}`)
};

export default groupRequest;