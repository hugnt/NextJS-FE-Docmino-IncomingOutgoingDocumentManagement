export type LookupModel = {
    id: number | string;
    name: string;
}

export type Lookup<TKey = string | number> = {
    id: TKey;
    name: string;
}