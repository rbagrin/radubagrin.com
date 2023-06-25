import { EntryDB } from "./entry.entity";
import { ModelsDB } from "./model.entity";

const EntryRepo = new EntryDB();
const ModelRepo = new ModelsDB();

export const DB = {
  ModelRepo,

  EntryRepo,
};
