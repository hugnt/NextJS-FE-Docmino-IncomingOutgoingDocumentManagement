import { DocType } from "./Document";

export type DocumentRegister = {
  id: string;
  name: string;
  year: number;
  isActive: boolean;
  description: string;
  registerType: DocType;
};

export const defaultDocumentRegister: DocumentRegister = {
  id: "",
  name: "",
  year: new Date().getFullYear(),
  isActive: true,
  description: "",
  registerType: DocType.None,
};