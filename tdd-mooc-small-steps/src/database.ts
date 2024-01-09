export type BasePrice = {
  type: string;
  cost: number;
};

export type Holiday = {
  holiday: string;
  description: string;
};

export interface Database {
  setBasePrice(type: string, cost: number): void;

  findBasePriceByType(type: string): BasePrice | undefined;

  addHoliday(holiday: string, description: string): void;

  getHolidays(): Holiday[];
}

export class InMemoryDatabase implements Database {
  basePrice: BasePrice[] = [];
  holidays: Holiday[] = [];

  withTestData() {
    this.setBasePrice("1jour", 35);
    this.setBasePrice("night", 19);
    this.addHoliday("2019-02-18", "winter");
    this.addHoliday("2019-02-25", "winter");
    this.addHoliday("2019-03-04", "winter");
    return this;
  }

  setBasePrice(type: string, cost: number) {
    this.basePrice = this.basePrice.filter((row) => row.type !== type);
    this.basePrice.push({ type, cost });
  }

  findBasePriceByType(type: string) {
    return this.basePrice.find((row) => row.type === type);
  }

  addHoliday(holiday: string, description: string) {
    this.holidays.push({ holiday, description });
  }

  getHolidays() {
    /**
     * structuredClone is not defined in old version of NodeJS:
     *  - ts-node ver. 10.9.2
     *  - nodeJs ver. 16.14.2
     * return structuredClone(this.holidays);
    */
    return this.holidays.map(obj => ({ ...obj }));
  }
}
