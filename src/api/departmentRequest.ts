import { httpClient } from "@/lib/httpClient";
import { Department } from "@/types/Department";
import { DataFilter } from "@/types/filter";
import { Lookup } from "@/types/lookup";

const departmentRequest = {
    lookup: () => httpClient.get<Lookup<number>[]>(`departments/look-up`),
    getByFilter: (filter?: DataFilter) => httpClient.get<Department[]>('departments', { params: filter }),
    getById: (id: number) => httpClient.get<Department>(`departments/${id}`),
    create: (body: Department) => httpClient.post('departments', body),
    update: (id: number, body: Department) => httpClient.put(`/departments/${id}`, body),
    delete: (id: number) => httpClient.delete(`departments/${id}`)
};

export default departmentRequest;