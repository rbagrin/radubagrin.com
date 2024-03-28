import axios from "axios";
import { ChamberType } from "../types/fibre-network.types";

export class ChamberAPI {
  static async getChambers(): Promise<ChamberType[]> {
    return (await axios.get("/api/chambers")).data;
  }
}
