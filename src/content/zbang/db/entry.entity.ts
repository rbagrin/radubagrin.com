import { EntryI } from "../zbang.interface";

export class EntryDB {
  private ENTRIES: EntryI[];
  private nextId = 3; // TODO: adjust id here;

  constructor() {
    this.ENTRIES = [
      createData(
        1,
        1,
        getDateAux(12, 25),
        getDateAux(12, 40),
        "Popescu Ion",
        "07312341332",
        true
      ),
      createData(
        2,
        2,
        getDateAux(13, 0),
        getDateAux(14, 0),
        "Ilie Baraghin",
        "068907643",
        true
      ),
    ];
  }

  async findAllEntries(): Promise<EntryI[]> {
    return [...this.ENTRIES];
  }

  async findEntryById(id: number): Promise<EntryI | undefined> {
    return this.ENTRIES.find((entry) => entry.id === id);
  }

  async addEntry(create: Omit<EntryI, "id">): Promise<void> {
    this.ENTRIES = [...this.ENTRIES, { ...create, id: this.nextId }];
    this.nextId = this.nextId + 1;
  }

  async updateEntryById(id: number, update: Partial<EntryI>): Promise<void> {
    this.ENTRIES = this.ENTRIES.map((entry) => {
      if (id !== entry.id) return entry;

      return { ...entry, ...update };
    });
  }

  async deleteById(id: number): Promise<void> {
    this.ENTRIES = this.ENTRIES.filter((entry) => entry.id !== id);
  }
}

function createData(
  id: number,
  modelId: number,
  start: Date,
  finish: Date,
  fullName: string,
  phoneNo: string,
  consent: boolean
): EntryI {
  return {
    id,
    modelId,
    start,
    finish,
    fullName,
    phoneNo,
    consent,
  };
}

function getDateAux(h: number, m: number): Date {
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}
