export type PositionLookup = {
    id: number;
    name: string;
    departmentName: string;
};


export type Position = {
    id: number;
    name: string;
    code: string;
    description: string;
    departmentId: number;
};

export const defaultPosition: Position = {
    id: 0,
    name: "",
    code: "",
    description: "",
    departmentId: 0
};