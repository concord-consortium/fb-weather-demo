import {Kriging} from "../kriging";

const data = {
  values: [0, 10, 0],
  xs:     [0, 1, 2],
  ys:     [0, 1, 2]
};

const kriging = Kriging();
const model = kriging.train(data.values, data.xs, data.ys, "gaussian", 0, 100);

// TODO: can we thinkg of a more robust integration test?
describe("Testing Kriging interpolation", () => {
  test("Tetsing the prediction at a known value (10)", () => {
    const predict11 = kriging.predict(1, 1, model);
    expect(predict11).toBeCloseTo(10);
  });

  test("Tetsing the prediction at a known value (0)", () => {
    const predict11 = kriging.predict(0, 0, model);
    expect(predict11).toBeCloseTo(0);
  });

  test("Tetsing the prediction at an unkown median point", () => {
    const predict11 = kriging.predict(0, 1, model);
    expect(predict11).toBeCloseTo(3.3, 0.1);
  });
});

