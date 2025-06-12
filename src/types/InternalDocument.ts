import { ConfirmProcess } from "./ConfirmProcess";
import { DocType, DocumentStatus, SecurePriority, UrgentPriority } from "./Document";
import { DocumentFile } from "./DocumentFile";
import { DataFilter } from "./filter";


export type InternalDocumentFilter = DataFilter & {
  documentType: DocType;
  startDate?: string;
  endDate?: string;
  departments?: number[];
  categories?: number[];
  fields?: number[];
  documentStatus?: DocumentStatus[];
  documentRegisters?: string[];
};


export type InternalDocument = {
  id: string;
  codeNotation: string;
  name: string;
  categoryName: string;
  documentRegisterName: string;
  fieldName: string;
  issuedDate: string;
  description: string;
  departmentName: string;
  arrivalNumber: string;
  arrivalDate: string;
  codeNumber: string;
};


export type InternalDocumentDetail = {
  id: string;
  name: string;
  categoryId: number;
  documentRegisterId: string;
  fieldId: number;
  codeNotation: string;
  issuedDate: string;
  departmentId: number;
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

export const defaultInternalDocumentDetail: InternalDocumentDetail = {
  id: "",
  name: "",
  categoryId: 0,
  documentRegisterId: "",
  fieldId: 0,
  codeNotation: "",
  issuedDate: "",
  departmentId: 0,
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