import { JSX } from "react";

export type Statistic = {
    title: string;
    total: number;
    subContent?: string | null;
    icon?: JSX.Element
    fill?: string,
};

export type MonthlyDocument = {
    month: string;
    incomingDocumentCount: number;
    outgoingDocumentCount: number;
    internalDocumentCount: number;
};