import { Address, Bytes } from "@graphprotocol/graph-ts";
import { extendArray, reduceArray, upcastCopy } from "../modules/ArrayHelper";

describe("ArrayHelper", () => {
    describe("extendArray", () => {
        it("should extend i32 array", () => {
            const baseArray = [1,2,3];
            const newValues = [5,6];
            const newArray = extendArray<i32>(baseArray, newValues);

            const expected = [1,2,3,5,6];

            expect(newArray).toStrictEqual(expected);
        });

        it("should extend Bytes array", () => {
            const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
            const newValues = [Bytes.fromI32(5), Bytes.fromI32(6)];

            const newArray = extendArray<Bytes>(baseArray, newValues);

            const expected = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10), Bytes.fromI32(5), Bytes.fromI32(6)];

            expect(newArray).toStrictEqual(expected);
        });

        it("should extend and not duplicate", () => {
            const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
            const reduceValues = [Bytes.fromI32(5), Bytes.fromI32(6), Bytes.fromI32(10)];

            const newArray = extendArray<Bytes>(baseArray, reduceValues);

            const expected = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10), Bytes.fromI32(5), Bytes.fromI32(6)];

            expect(newArray).toStrictEqual(expected);
        });
    });

    describe("reduceArray", () => {
        it("should reduce i32 array", () => {
            const baseArray = [1,2,3];
            const reduceValues = [2]
            const newArray = reduceArray<i32>(baseArray, reduceValues);

            const expected = [1,3];

            expect(newArray).toStrictEqual(expected);
        });

        it("should reduce Bytes array", () => {
            const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
            const reduceValues = [Bytes.fromI32(10)];

            const newArray = reduceArray<Bytes>(baseArray, reduceValues);

            const expected = [Bytes.fromI32(1), Bytes.fromI32(2)];

            expect(newArray).toStrictEqual(expected);
        });

        it("should reduce if in reduceValues are not in base", () => {
            const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
            const reduceValues = [Bytes.fromI32(10), Bytes.fromI32(5)];

            const newArray = reduceArray<Bytes>(baseArray, reduceValues);

            const expected = [Bytes.fromI32(1), Bytes.fromI32(2)];

            expect(newArray).toStrictEqual(expected);
        });
    });

    describe("upcastCopy", () => {
        it("should upcast", () => {
            const baseArray = [Address.fromBytes(Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679")),Address.fromBytes(Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670"))];
            const expected = [Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679"),Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670")];

            const newArray = upcastCopy<Address,Bytes>(baseArray);

            expect(newArray).toStrictEqual(expected);
        });
    });
});