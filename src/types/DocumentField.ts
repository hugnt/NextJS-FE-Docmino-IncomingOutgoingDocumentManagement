export type DocumentField = {
  id: number;
  name: string;
  code: string;
  description: string;
};

export const defaultDocumentField: DocumentField = {
  id: 0,
  name: "",
  code: "",
  description: ""
};