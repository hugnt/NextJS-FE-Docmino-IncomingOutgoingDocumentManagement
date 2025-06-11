
import { httpClient } from "@/lib/httpClient";
import { Position, PositionLookup } from "@/types/Position";
import { DataFilter } from "@/types/filter";

const positionRequest = {
    lookup: () => httpClient.get<PositionLookup[]>('positions/look-up'),
    getByFilter: (filter?: DataFilter) => httpClient.get<Position[]>('positions', { params: filter }),
    getById: (id: number) => httpClient.get<Position>(`positions/${id}`),
    create: (body: Position) => httpClient.post('positions', body),
    update: (id: number, body: Position) => httpClient.put(`/positions/${id}`, body),
    delete: (id: number) => httpClient.delete(`positions/${id}`)
};

export default positionRequest;