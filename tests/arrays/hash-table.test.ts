import { assert, beforeAll, describe, log, test } from "matchstick-as";
import { HashTable } from "../../modules/index";
import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";

const hashTable = new HashTable<Bytes, BigInt>([], [], 0);

describe("hash-table", () => {
  describe("constructor", () => {
    test(
      "should fail when array lengths are not equal",
      () => {
        new HashTable<ByteArray, BigInt>(
          [Bytes.fromBigInt(BigInt.fromI32(1)), Bytes.fromBigInt(BigInt.fromI32(2))],
          [BigInt.fromI32(3)],
          2
        );
      },
      true
    );

    test(
      "should fail when key array length less then activeKeysCount",
      () => {
        new HashTable<ByteArray, BigInt>(
          [Bytes.fromBigInt(BigInt.fromI32(1)), Bytes.fromBigInt(BigInt.fromI32(2))],
          [BigInt.fromI32(1), BigInt.fromI32(2)],
          5
        );
      },
      true
    );
  });

  describe("set()", () => {
    test("should set values", () => {
      const newKeys = [Bytes.fromI32(1), Bytes.fromI32(2)];
      const newValues = [BigInt.fromI32(20), BigInt.fromI32(30)];

      for (let i = 0; i < newKeys.length; i++) {
        hashTable.set(newKeys[i], newValues[i]);
      }

      for (let i = 0; i < newKeys.length; i++) {
        assert.stringEquals(hashTable.get(newKeys[i]).toString(), newValues[i].toString());
      }

      assert.stringEquals(hashTable.getActiveKeysCount().toString(), newKeys.length.toString());
    });

    test("should add new value", () => {
      const newKey = Bytes.fromI32(11);
      const newValue = BigInt.fromI32(11);
      const activeKeysCount = hashTable.getActiveKeysCount();

      hashTable.set(newKey, newValue);

      assert.stringEquals(hashTable.get(newKey).toString(), newValue.toString());
      assert.stringEquals(hashTable.getActiveKeysCount().toString(), (activeKeysCount + 1).toString());
    });

    test("should correctly set Address as key", () => {
      const newKey = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679");
      const newValue = BigInt.fromI32(5);
      const activeKeysCount = hashTable.getActiveKeysCount();

      hashTable.set(newKey, newValue);

      assert.stringEquals(hashTable.get(newKey).toString(), newValue.toString());
      assert.stringEquals(hashTable.getActiveKeysCount().toString(), (activeKeysCount + 1).toString());
    });

    test("should correctly set, when key isn't in BytesArray class tree", () => {
      const newHashTable = new HashTable<BigInt, BigInt>([], [], 0);
      newHashTable.set(BigInt.fromI32(4), BigInt.fromI32(4));

      assert.stringEquals(newHashTable.get(BigInt.fromI32(4)).toString(), BigInt.fromI32(4).toString());
    });
  });

  describe("get()", () => {
    test(
      "should trow Key not found",
      () => {
        const key = Bytes.fromI32(50);

        hashTable.get(key);
      },
      true
    );
  });

  describe("resizeAndRehash()", () => {
    beforeAll(() => {
      for (let i = 0; hashTable.getLoadFactor() < HashTable.MAX_LOAD_FACTOR; i++) {
        hashTable.set(Bytes.fromI32(i), BigInt.fromI32(i + 100));

        assert.stringEquals(hashTable.get(Bytes.fromI32(i)).toString(), BigInt.fromI32(i + 100).toString());
      }
    });

    test("should resize", () => {
      hashTable.set(Bytes.fromI32(7), BigInt.fromI32(7 + 100));
    });
  });
});
