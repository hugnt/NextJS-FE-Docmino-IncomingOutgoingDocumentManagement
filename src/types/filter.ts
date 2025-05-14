export type DataFilter = {
    pageSize?: number,
    pageNumber?: number,
    totalRecords?: number,
    searchValue?: string
}

export const defaultFilter: DataFilter = {
    pageSize: 10,
    pageNumber: 1,
    totalRecords: 0,
}
