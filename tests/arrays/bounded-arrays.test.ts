import { describe, assert, test } from "matchstick-as";
import { BoundedArrays } from "../../modules";
import { BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";

const keys = [Bytes.fromBigInt(BigInt.fromI32(1)), Bytes.fromBigInt(BigInt.fromI32(2))];
const values = [BigInt.fromI32(1), BigInt.fromI32(2)];
const boundedArrays = new BoundedArrays<ByteArray, BigInt>(keys, values);

describe("bounded-arrays", () => {
  describe("constructor", () => {
    test(
      "should fail when array lengths are not equal",
      () => {
        new BoundedArrays<ByteArray, BigInt>(
          [Bytes.fromBigInt(BigInt.fromI32(1)), Bytes.fromBigInt(BigInt.fromI32(2))],
          [BigInt.fromI32(3)]
        );
      },
      true
    );
  });

  describe("get()", () => {
    test("should get value by key", () => {
      for (let i = 0; i < keys.length; i++) {
        assert.stringEquals(boundedArrays.get(keys[i]).toString(), values[i].toString());
      }
    });

    test(
      "should fail with key not found",
      () => {
        boundedArrays.get(Bytes.fromBigInt(BigInt.fromI32(10)));
      },
      true
    );
  });

  describe("set()", () => {
    test("should set values", () => {
      const newValues = [BigInt.fromI32(20), BigInt.fromI32(30)];

      for (let i = 0; i < keys.length; i++) {
        boundedArrays.set(keys[i], newValues[i]);
      }

      for (let i = 0; i < keys.length; i++) {
        assert.stringEquals(boundedArrays.get(keys[i]).toString(), values[i].toString());
      }
    });

    test("should add new value", () => {
      const newKey = Bytes.fromBigInt(BigInt.fromI32(11));
      const newValue = BigInt.fromI32(11);

      boundedArrays.set(newKey, newValue);

      assert.stringEquals(boundedArrays.get(newKey).toString(), newValue.toString());
    });
  });

  describe("includes()", () => {
    test("should return true", () => {
      for (let i = 0; i < keys.length; i++) {
        assert.assertTrue(boundedArrays.includes(keys[i]));
      }
    });

    test("should return false", () => {
      assert.assertTrue(!boundedArrays.includes(Bytes.fromBigInt(BigInt.fromI32(10))));
    });
  });

  describe("getKeys", () => {
    test("should get key array", () => {
      boundedArrays.set(Bytes.fromBigInt(BigInt.fromI32(11)), BigInt.fromI32(11));
      keys.push(Bytes.fromBigInt(BigInt.fromI32(11)));
      values.push(BigInt.fromI32(11));

      assert.stringEquals(boundedArrays.getKeys().toString(), keys.toString());
    });
  });

  describe("getValues", () => {
    test("should get key array", () => {
      assert.stringEquals(boundedArrays.getValues().toString(), values.toString());
    });
  });
});
