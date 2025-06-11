export type StoragePeriod = {
  id: number;
  name: string;
  yearAmount: number;
  description: string;
};

export const defaultStoragePeriod: StoragePeriod = {
  id: 0,
  name: "",
  yearAmount: 0,
  description: "",
};