/* eslint-disable @typescript-eslint/no-explicit-any */
export type Result<T = any> = {
    message?: string;
    isSuccess: boolean;
    statusCode: number;
    errors?: string[];
    data?: T;
    totalRecords?: number
};

