import { ModelI } from "../zbang.interface";

export class ModelsDB {
  private MODELS: ModelI[];

  constructor() {
    this.MODELS = [
      {
        id: 1,
        name: "ATV",
        priceModel: {
          level1: 25, // 15 min
          level2: 40, // 30 min
          level3: 70, // 1h
          level4: 100, // 2h
          extraPerMinute: 1,
        },
      },
      {
        id: 2,
        name: "Politie",
        priceModel: {
          level1: 30, // 15 min
          level2: 50, // 30 min
          level3: 80, // 1h
          level4: 150, // 2h
          extraPerMinute: 1,
        },
      },
      {
        id: 3,
        name: "Tractor",
        priceModel: {
          level1: 25, // 15 min
          level2: 40, // 30 min
          level3: 70, // 1h
          level4: 130, // 2h
          extraPerMinute: 1,
        },
      },
      {
        id: 4,
        name: "Extra",
        priceModel: {
          level1: 35, // 15 min
          level2: 50, // 30 min
          level3: 90, // 1h
          level4: 150, // 2h
          extraPerMinute: 1,
        },
      },
    ];
  }

  async findAllModels(): Promise<ModelI[]> {
    return this.MODELS;
  }

  async findModelById(id: number): Promise<ModelI | undefined> {
    return this.MODELS.find((model) => model.id === id);
  }
}
