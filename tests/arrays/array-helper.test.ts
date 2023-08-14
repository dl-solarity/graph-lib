import { describe, assert, test } from "matchstick-as";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { pushUnique, remove, upcastCopy } from "../../lib";

describe("array-helper", () => {
  describe("pushUnique", () => {
    test("should extend i32 array", () => {
      const baseArray = [1, 2, 3];
      const newValues = [5, 6];
      const newArray = pushUnique<i32>(baseArray, newValues);

      const expected = [1, 2, 3, 5, 6];

      assert.stringEquals(newArray.toString(), expected.toString());
    });

    test("should extend Bytes array", () => {
      const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
      const newValues = [Bytes.fromI32(5), Bytes.fromI32(6)];

      const newArray = pushUnique<Bytes>(baseArray, newValues);

      const expected = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10), Bytes.fromI32(5), Bytes.fromI32(6)];

      assert.stringEquals(newArray.toString(), expected.toString());
    });

    test("should extend and not duplicate", () => {
      const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
      const reduceValues = [Bytes.fromI32(5), Bytes.fromI32(6), Bytes.fromI32(10)];

      const newArray = pushUnique<Bytes>(baseArray, reduceValues);

      const expected = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10), Bytes.fromI32(5), Bytes.fromI32(6)];

      assert.stringEquals(newArray.toString(), expected.toString());
    });
  });

  describe("remove", () => {
    test("should reduce i32 array", () => {
      const baseArray = [1, 2, 3];
      const reduceValues = [2];
      const newArray = remove<i32>(baseArray, reduceValues);

      const expected = [1, 3];

      assert.stringEquals(newArray.toString(), expected.toString());
    });

    test("should reduce Bytes array", () => {
      const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
      const reduceValues = [Bytes.fromI32(10)];

      const newArray = remove<Bytes>(baseArray, reduceValues);

      const expected = [Bytes.fromI32(1), Bytes.fromI32(2)];

      assert.stringEquals(newArray.toString(), expected.toString());
    });

    test("should reduce if in reduceValues are not in base", () => {
      const baseArray = [Bytes.fromI32(1), Bytes.fromI32(2), Bytes.fromI32(10)];
      const reduceValues = [Bytes.fromI32(10), Bytes.fromI32(5)];

      const newArray = remove<Bytes>(baseArray, reduceValues);

      const expected = [Bytes.fromI32(1), Bytes.fromI32(2)];

      assert.stringEquals(newArray.toString(), expected.toString());
    });
  });

  describe("upcastCopy", () => {
    test("should upcast", () => {
      const baseArray = [
        Address.fromBytes(Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679")),
        Address.fromBytes(Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670")),
      ];
      const expected = [
        Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679"),
        Bytes.fromHexString("0x76e98f7d84603AEb97cd1c89A80A9e914f181670"),
      ];

      const newArray = upcastCopy<Address, Bytes>(baseArray);

      assert.stringEquals(newArray.toString(), expected.toString());
    });
  });
});
