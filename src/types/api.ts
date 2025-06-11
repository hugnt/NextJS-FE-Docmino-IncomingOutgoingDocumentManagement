/* eslint-disable @typescript-eslint/no-explicit-any */
export type Result<T = any> = {
    message?: string;
    isSuccess: boolean;
    statusCode: number;
    errors?: string[];
    data?: T;
    totalRecords?: number
};


export type KeyValue<TKey = any, TValue = any> = {
    key: TKey,
    value: TValue
}