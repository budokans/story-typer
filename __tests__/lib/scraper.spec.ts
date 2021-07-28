import { testables } from "../../lib/scraper";
const { getParamsString } = testables;

describe("getParamsString", () => {
  test("joins returns a string of DEFAULT_PARAMS elements joined with &", () => {
    const DEFAULT_PARAMS = ["1", "2", "3"];
    const result = getParamsString(DEFAULT_PARAMS);
    expect(result).toEqual("1&2&3");
  });
});
