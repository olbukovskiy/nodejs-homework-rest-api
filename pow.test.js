const pow = require("./pow");

describe("hooks", function () {
  beforeAll(() => {
    console.log("Виконати на початку тестів");
  });

  afterAll(() => {
    console.log("Виконати після тестів");
  });

  beforeEach(() => {
    console.log("Виконати на початку кожного тесту");
  });

  afterEach(() => {
    console.log("Виконати наприкінці кожного тесту");
  });

  test("1 to power 2 to equal 1", () => {
    console.log("1 to power 2 to equal 1");
    expect(pow(1, 2)).toBe(1);
  });

  test("3 to power 2 to equal 9", () => {
    console.log("3 to power 2 to equal 9");
    expect(pow(3, 2)).toBe(9);
  });
});
