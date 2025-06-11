export enum ReviewerType {
  User = 0,
  Group = 1,
  Position = 2,
  Deparment = 3,
}

export enum SignType {
  None = 0,
  Image = 1,
  DigitalSignature = 2,
  Blockchain = 3,
}

export enum ProcessType {
  None = 0,
  Secure = 1,
  Normal = 2,
  Important = 3,
}

export enum ProcessStatus {
  None = 0,
  InProcess = 1,
  Cancelled = 2,
  Completed = 3,
}

export type ProcessSignDetail = {
  fileId?: string;
  fileIndex?: number;
  posX: number;
  posY: number;
  signZoneWidth: number;
  signZoneHeight: number;
  signPage: number;
  translateX?: number;
  translateY?: number;
};

export type ProcessDetail = {
  id?: string;
  stepNumber: number;
  reviewerType: ReviewerType;
  reviewerUserId?: string | null;
  reviewerGroupId?: string | null;
  reviewerPositionId?: number | null;
  reviewerDepartmentId?: number | null;
  vetoRight: boolean;
  dateStart?: string | null; // ISO date string
  dateEnd?: string | null; // ISO date string
  resignDateEnd?: string | null; // ISO date string
  signDetails?: ProcessSignDetail[] | null;
  signType?: SignType;

  reviewerName?: string;
  actionName?: string;
  reviewerId?: string;
};

export type ProcessHistory = {
  id: string; // Guid => string
  processId: string; // Guid => string
  processName: string;
  currentStepNumber: number;
  currentStatusName: string;
  reviewerName: string;
  userReviewerName: string;
  comment: string;
  actionName: string;
  nextStepNumber: number;
  txHash: string;
  createdAt: string; // DateTime => ISO string
  processSignHistories: string[];
};

export type ConfirmProcess = {
  id: string;
  documentId?: string;
  name: string;
  type: ProcessType;
  managerId: string;
  currentStepNumber: number;
  blockchainEnabled: boolean;
  description?: string;
  status: ProcessStatus;
  processDetails?: ProcessDetail[] | null;
  processHistories?: ProcessHistory[] | null;
};

export type ApproveDocumentRequest = {
  digitalSignaturePassword?: string | null;
  imageSignatures?: ImageSignature[] | null;
  comment?: string | null;
};

export type ImageSignature = {
  fileId?: string;
  image?: File | null;
  isVerify: boolean;
};

export type RejectDocumentRequest = {
  comment: string;
  rollbackStep: number;
};

export const defaultConfirmProcess: ConfirmProcess = {
  id: "",
  name: "",
  type: ProcessType.Normal,
  managerId: "",
  blockchainEnabled: false,
  description: "",
  currentStepNumber: 1,
  status: ProcessStatus.None,
  processDetails: [],
};

export const defaultProcessDetails: ProcessDetail = {
  stepNumber: 1,
  reviewerType: ReviewerType.User,
  reviewerId: "",
  reviewerName: "",
  signType: SignType.None,
  actionName: "Chỉ duyệt",
  dateStart: "",
  dateEnd: "",
  vetoRight: false,
  reviewerUserId: null,
  reviewerGroupId: null,
  reviewerPositionId: null,
  reviewerDepartmentId: null,
  resignDateEnd: "",
  signDetails: [],
};
