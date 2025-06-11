"use client"
import documentRequest from "@/api/documentRequest";
import PageLoading from "@/components/loading/PageLoading";
import { KeyValue } from "@/types/api";
import { DocType, DocumentNavigationOptions } from "@/types/Document";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type DocumentContextType = DocumentNavigationOptions & {
    loading: boolean
}

const DocumentContext = createContext<DocumentContextType>({
    arrivalDates: [],
    categories: [],
    fields: [],
    documentRegisters: [],
    documentStatus: [],
    organizations: [],
    reviewerTypes: [],
    securePriorities: [],
    urgentPriorities: [],
    processTypes: [],
    signTypes: [],
    processManagers: [],
    loading: false
})

export const useDocumentContext = () => useContext(DocumentContext);

const DocumentProvider: React.FC<{ children: ReactNode, documentType?: DocType }> = ({ children, documentType }) => {
    const [arrivalDates, setArrivalDates] = useState<string[]>([]);
    const [categories, setCategories] = useState<KeyValue[]>([]);
    const [fields, setFields] = useState<KeyValue[]>([]);
    const [documentRegisters, setDocumentRegisters] = useState<KeyValue[]>([]);
    const [documentStatus, setDocumentStatus] = useState<KeyValue[]>([]);
    const [organizations, setOrganizations] = useState<KeyValue[]>([]);
    const [securePriorities, setSecurePriorities] = useState<KeyValue[]>([]);
    const [urgentPriorities, setUrgentPriorities] = useState<KeyValue[]>([]);
    const [reviewerTypes, setReviewerTypes] = useState<KeyValue[]>([]);
    const [processTypes, setProcessTypes] = useState<KeyValue[]>([]);
    const [signTypes, setSignTypes] = useState<KeyValue[]>([]);
    const [processManagers, setProcessManagers] = useState<KeyValue[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        documentRequest.getNavigationOptions(documentType).then(res => {
            setArrivalDates(res.data?.arrivalDates ?? []);
            setCategories(res.data?.categories ?? []);
            setFields(res.data?.fields ?? []);
            setDocumentRegisters(res.data?.documentRegisters ?? []);
            setDocumentStatus(res.data?.documentStatus ?? []);
            setOrganizations(res.data?.organizations ?? []);
            setSecurePriorities(res.data?.securePriorities ?? []);
            setUrgentPriorities(res.data?.urgentPriorities ?? []);
            setReviewerTypes(res.data?.reviewerTypes ?? []);
            setProcessTypes(res.data?.processTypes ?? []);
            setSignTypes(res.data?.signTypes ?? []);
            setProcessManagers(res.data?.processManagers ?? []);
        }).finally(() => setLoading(false))
    }, [documentType]);

    const contextValue: DocumentContextType = {
        loading,
        arrivalDates,
        categories,
        fields,
        documentRegisters,
        documentStatus,
        organizations,
        securePriorities,
        urgentPriorities,
        reviewerTypes,
        processTypes,
        processManagers,
        signTypes,
    };
    if(loading) return <PageLoading />;
    return <DocumentContext.Provider value={contextValue}>{children}</DocumentContext.Provider>;
}

export default DocumentProvider;