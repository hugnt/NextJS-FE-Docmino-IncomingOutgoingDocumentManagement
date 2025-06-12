"use client"
import documentRequest from "@/api/documentRequest";
import PageLoading from "@/components/loading/PageLoading";
import { DocType, DocumentLookup } from "@/types/Document";
import { Lookup } from "@/types/lookup";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type DocumentContextType = DocumentLookup & {
    loading: boolean
}

const DocumentContext = createContext<DocumentContextType>({
    arrivalDates: [],
    categories: [],
    fields: [],
    documentRegisters: [],
    documentStatus: [],
    organizations: [],
    departments: [],
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
    const [categories, setCategories] = useState<Lookup<number>[]>([]);
    const [fields, setFields] = useState<Lookup<number>[]>([]);
    const [documentRegisters, setDocumentRegisters] = useState<Lookup<string>[]>([]);
    const [documentStatus, setDocumentStatus] = useState<Lookup<number>[]>([]);
    const [organizations, setOrganizations] = useState<Lookup<number>[]>([]);
    const [departments, setDepartments] = useState<Lookup<number>[]>([]);
    const [securePriorities, setSecurePriorities] = useState<Lookup<number>[]>([]);
    const [urgentPriorities, setUrgentPriorities] = useState<Lookup<number>[]>([]);
    const [reviewerTypes, setReviewerTypes] = useState<Lookup<number>[]>([]);
    const [processTypes, setProcessTypes] = useState<Lookup<number>[]>([]);
    const [signTypes, setSignTypes] = useState<Lookup<number>[]>([]);
    const [processManagers, setProcessManagers] = useState<Lookup<string>[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        documentRequest.getDocumentLookup(documentType).then(res => {
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
            setDepartments(res.data?.departments ?? []);
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
        departments,
    };
    if(loading) return <PageLoading />;
    return <DocumentContext.Provider value={contextValue}>{children}</DocumentContext.Provider>;
}

export default DocumentProvider;