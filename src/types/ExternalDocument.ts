import { ConfirmProcess } from "./ConfirmProcess";
import { DocType, DocumentStatus, SecurePriority, UrgentPriority } from "./Document";
import { DocumentFile } from "./DocumentFile";
import { DataFilter } from "./filter";


export type ExternalDocumentFilter = DataFilter & {
  documentType: DocType;
  startDate?: string;
  endDate?: string;
  arrivalDates?: string[];
  categories?: number[];
  fields?: number[];
  documentStatus?: DocumentStatus[];
  documentRegisters?: string[];
};


export type ExternalDocument = {
  id: string;
  codeNotation: string;
  name: string;
  categoryName: string;
  documentRegisterName: string;
  fieldName: string;
  issuedDate: string;
  description: string;
  organizationName: string;
  arrivalNumber: string;
  arrivalDate: string;
  codeNumber: string;
};


export type ExternalDocumentDetail = {
  id: string;
  name: string;
  categoryId: number;
  documentRegisterId: string;
  fieldId: number;
  codeNotation: string;
  issuedDate: string;
  organizationId: number;
  subject: string;
  pageAmount: number;
  description: string;
  securePriority: SecurePriority;
  urgentPriority: UrgentPriority;
  arrivalNumber: string;
  arrivalDate: string;
  codeNumber: string;
  toPlaces: string;
  dueDate: string;
  issuedAmount: number;
  documentStatus: DocumentStatus;
  documentFiles?: DocumentFile[] | null;
  confirmProcess?: ConfirmProcess | null;
  processCount?: number;
};

export const defaultExternalDocumentDetail: ExternalDocumentDetail = {
  id: "",
  name: "",
  categoryId: 0,
  documentRegisterId: "",
  fieldId: 0,
  codeNotation: "",
  issuedDate: "",
  organizationId: 0,
  subject: "",
  pageAmount: 0,
  description: "",
  securePriority: SecurePriority.Normal,
  urgentPriority: UrgentPriority.Normal,
  arrivalNumber: "",
  arrivalDate: "",
  codeNumber: "",
  toPlaces: "",
  dueDate: "",
  issuedAmount: 0,
  documentStatus: DocumentStatus.Draff,
  documentFiles: null,
  confirmProcess: null,
};