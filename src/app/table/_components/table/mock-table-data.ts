import { faker } from "@faker-js/faker";

export type BaseTableData = {
  id: number;
  task: string;
  description: string;
  asignee: string;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (index: number): BaseTableData => {
  return {
    id: index + 1,
    task: faker.person.firstName(), // Generates a random first name
    description: faker.person.lastName(), // Generates a random last name
    asignee: faker.person.lastName(), // Generates a random last name
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): BaseTableData[] => {
    const len = lens[depth]!;
    return range(len).map((d): BaseTableData => {
      return {
        ...newPerson(d),
      };
    });
  };

  return makeDataLevel();
}
