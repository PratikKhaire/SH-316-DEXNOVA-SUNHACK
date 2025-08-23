export type Land = {
  id: bigint;
  location: string;
  ownerName: string;
  ownerAddress: string;
  documentHash: string;
  exists: boolean;
  area: string; // This will be used to store the area, populated from documentHash
};
