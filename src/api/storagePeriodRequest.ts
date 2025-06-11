
import { httpClient } from "@/lib/httpClient";
import { DataFilter } from "@/types/filter";
import { Lookup } from "@/types/lookup";
import { StoragePeriod } from "@/types/StoragePeriod";

const storagePeriodRequest = {
    lookup: () => httpClient.get<Lookup[]>('storage-periods/look-up'),
    getByFilter: (filter?: DataFilter) => httpClient.get<StoragePeriod[]>('storage-periods', { params: filter }),
    getById: (id: number) => httpClient.get<StoragePeriod>(`storage-periods/${id}`),
    create: (body: StoragePeriod) => httpClient.post('storage-periods', body),
    update: (id: number, body: StoragePeriod) => httpClient.put(`/storage-periods/${id}`, body),
    delete: (id: number) => httpClient.delete(`storage-periods/${id}`)
};

export default storagePeriodRequest;