import { PATH } from "@/constants/paths";
import { ReviewerType, SignType } from "./ConfirmProcess";
import { DataFilter } from "./filter";
import { Lookup } from "./lookup";

export enum DocType {
  None = 0,
  Incoming = 1,
  Outgoing = 2,
  InternalIncoming = 3,
  InternalOutgoing = 4,
}

export enum DocumentStatus {
  Draff = 0,
  InProcess = 1,
  Published = 2,
  Cancel = 3,
}

export enum SecurePriority {
  Normal = 0,
  Low = 1,
  High = 2,
  Secure = 3,
  SuperSecure = 4,
}

export enum UrgentPriority {
  Normal = 0,
  Low = 1,
  High = 2,
  Urgent = 3,
  SuperUrgent = 4,
}

export type ProcessingDocument = {
  id: string;
  name?: string | null;
  documentRegisterName: string;
  documentType: DocType;
  currentStepNumber: number;
  totalStepNumber: number;
  codeNotation: string;
  categoryName: string;
  issuedDate: string;
};

export type SignedDocument = {
  id: string; 
  name?: string | null;
  documentRegisterName: string;
  documentType: DocType;
  currentStepNumber: number;
  nextStepNumber: number;
  codeNotation: string;
  isApproved: boolean;
  actionName: string;
  approvedAt: string; 
};


export type ProcessingDocumentFilter = DataFilter & {
  documentType: DocType;
  startDate?: string;
  endDate?: string;
};

export type DocumentFilter = DataFilter & {
  documentType?: DocType | null;
  startDate?: string;
  endDate?: string;
};

export type PublishDocumentFilter = DataFilter & {
  documentType?: DocType | null;
  codeNotation?: string;
  storageId?: string | null;
};


export type DocumentLookup = {
  arrivalDates?: string[];
  categories?: Lookup<number>[];
  fields?: Lookup<number>[];
  documentRegisters?: Lookup<string>[];
  documentStatus?: Lookup<number>[];
  organizations?: Lookup<number>[];
  departments?: Lookup<number>[];
  securePriorities?: Lookup<number>[];
  urgentPriorities?: Lookup<number>[];

  reviewerTypes?: Lookup<number>[];
  processTypes?: Lookup<number>[];
  signTypes?: Lookup<number>[];
  processManagers?: Lookup<string>[];
};

export type ReviewerLookup = {
  groups?: Lookup<string>[];
  departments?: Lookup<number>[];
  positions?: Lookup<number>[];
  users?: Lookup<string>[];
};

export function getDocumentStatusName(status: DocumentStatus): string {
  switch (status) {
    case DocumentStatus.Draff:
      return "Bản nháp";
    case DocumentStatus.InProcess:
      return "Đang xử lý";
    case DocumentStatus.Published:
      return "Đã phát hành";
    case DocumentStatus.Cancel:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
}

export function getDocTypeName(documentType: DocType): string {
  switch (documentType) {
    case DocType.Incoming:
      return "Văn bản đến";
    case DocType.Outgoing:
      return "Văn bản đi";
    case DocType.InternalIncoming:
      return "Văn bản nội bộ đến";
    case DocType.InternalOutgoing:
      return "Văn bản nội bộ đi";
    case DocType.None:
      return "Nháp";
    default:
      return "Không xác định";
  }
}

export function getDocumentUrl(documentType: DocType, id: string): string {
  switch (documentType) {
    case DocType.Incoming:
      return `${PATH.DocumentExternalIncoming}/${id}`;
    case DocType.Outgoing:
      return `${PATH.DocumentExternalOutgoing}/${id}`;
    case DocType.InternalIncoming:
      return `${PATH.DocumentInternalIncoming}/${id}`;
    case DocType.InternalOutgoing:
      return `${PATH.DocumentInternalOutgoing}/${id}`;
    case DocType.None:
    default:
      return "Không xác định";
  }
}


export function getSignTypeName(signType: SignType): string {
  switch (signType) {
    case SignType.None:
      return "Chỉ duyệt";
    case SignType.Image:
      return "Chữ ký hình ảnh";
    case SignType.DigitalSignature:
      return "Chữ ký số";
    case SignType.Blockchain:
      return "Blockchain";
    default:
      return "Không xác định";
  }
}

export function getReviewerTypeName(reviewerType: ReviewerType): string {
  switch (reviewerType) {
    case ReviewerType.User:
      return "Người dùng";
    case ReviewerType.Group:
      return "Nhóm";
    case ReviewerType.Position:
      return "Chức vụ";
    case ReviewerType.Deparment:
      return "Phòng ban";
    default:
      return "Không xác định";
  }
}

export function isUserCanAddSignature(signType?: SignType): boolean {
  return signType === SignType.Image || signType === SignType.DigitalSignature || signType === SignType.Blockchain;
}

