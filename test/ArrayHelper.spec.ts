import { extendArray } from "../modules/ArrayHelper";

describe("ArrayHelper", () => {
    it("should extend base array", () => {
        const BASE_ARRAY = [1,2,3];
        const newValues = [5,6];
        const newArray = extendArray<i32>(BASE_ARRAY, newValues);

        const expected = [1,2,3,5,6];

        expect(newArray).toStrictEqual(expected);
    });
});