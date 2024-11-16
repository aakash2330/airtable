import { faker } from "@faker-js/faker";

export type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: "relationship" | "complicated" | "single";
  createdAt: Date;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (index: number): Person => {
  return {
    id: index + 1,
    firstName: faker.person.firstName(), // Generates a random first name
    lastName: faker.person.lastName(), // Generates a random last name
    age: faker.number.int({ max: 40 }), // Generates an age up to 40
    visits: faker.number.int({ max: 1000 }), // Generates visits up to 1000
    progress: faker.number.int({ max: 100 }), // Generates progress percentage up to 100
    createdAt: faker.date.past(), // Generates a random past date
    status: faker.helpers.arrayElement([
      "relationship",
      "complicated",
      "single",
    ]), // Picks a random status
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(d),
      };
    });
  };

  return makeDataLevel();
}
