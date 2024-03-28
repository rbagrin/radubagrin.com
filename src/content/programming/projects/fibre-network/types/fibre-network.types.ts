export type ChamberType = {
  id: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  usedCapacity: number;
  geom: {
    coordinates: number[];
    type: "Point";
    crs: Record<string, unknown>;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerType = {
  id: string;
  name: string;
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
  geom: {
    coordinates: number[];
    type: "Point";
    crs: Record<string, unknown>;
  };
  capacity: number;
  chamberId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerType = Omit<
  CustomerType,
  "id" | "geom" | "chamberId" | "createdAt" | "updatedAt"
>;

export type CustomerRegistrationResponseType = {
  customerId: string | null;
  chamberId: string | null;
  success: boolean;
  isClosest: boolean;
  customerMessage: string;
  chamberMessage: string;
  leftCapacity: number | null;
};
