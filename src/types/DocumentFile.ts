
export enum FileEncoding {
  None = 0,
  Base64 = 1,
  UTF8 = 2,
  Remote = 3,
}

export type DocumentFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  fileEncoding?: FileEncoding;
  description?: string;
  createdAt?: string;

  file?: File;
  fileIndex?: number;
  isNewFile: boolean;
  isSigned: boolean;
};
