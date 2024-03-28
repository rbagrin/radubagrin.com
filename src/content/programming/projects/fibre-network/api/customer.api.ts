import axios from "axios";
import {
  CreateCustomerType,
  CustomerRegistrationResponseType,
  CustomerType,
} from "../types/fibre-network.types";

export class CustomerAPI {
  static async getCustomers(): Promise<CustomerType[]> {
    return (await axios.get("/api/customers")).data;
  }

  static async createCustomer(
    values: CreateCustomerType
  ): Promise<CustomerRegistrationResponseType> {
    return (await axios.post("/api/customers", values)).data;
  }
}
