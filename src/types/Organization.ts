export type Organization = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  contactPersonName: string;
  description: string;
};

export const defaultOrganization: Organization = {
  id: 0,
  name: "",
  phoneNumber: "",
  email: "",
  contactPersonName: "",
  description: ""
};