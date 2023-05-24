import { assert, beforeAll, describe, test } from "matchstick-as";
import { HashTable } from "../../modules/index";
import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";

let hashTable = new HashTable<Bytes, BigInt>([], [], 0);

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
        assert.assertTrue(hashTable.includes(newKeys[i]));
      }

      assert.stringEquals(hashTable.getActiveKeysCount().toString(), newKeys.length.toString());
    });

    test("should add new value, with collision", () => {
      const newKey = Bytes.fromI32(11);
      const newValue = BigInt.fromI32(11);
      const activeKeysCount = hashTable.getActiveKeysCount();

      hashTable.set(newKey, newValue);

      assert.stringEquals(hashTable.get(newKey).toString(), newValue.toString());
      assert.stringEquals(hashTable.getActiveKeysCount().toString(), (activeKeysCount + 1).toString());

      assert.stringEquals(hashTable.getHash(newKey, hashTable.getKeys().length).toString(), "1");
      assert.stringEquals(hashTable.getKeys().indexOf(newKey).toString(), "3");
    });

    test("should add new value, with collision and overflow", () => {
      const newKey = Bytes.fromI32(19);
      const newValue = BigInt.fromI32(19);

      hashTable.set(Bytes.fromI32(9), BigInt.fromI32(9));
      assert.stringEquals(hashTable.get(Bytes.fromI32(9)).toString(), BigInt.fromI32(9).toString());

      hashTable.set(newKey, newValue);
      assert.stringEquals(hashTable.get(newKey).toString(), newValue.toString());

      assert.stringEquals(hashTable.getHash(newKey, hashTable.getKeys().length).toString(), "9");
      assert.stringEquals(hashTable.getKeys().indexOf(newKey).toString(), "0");
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
      hashTable = new HashTable<Bytes, BigInt>([], [], 0);

      for (let i = 1; hashTable.getLoadFactor() < HashTable.MAX_LOAD_FACTOR; i++) {
        hashTable.set(Bytes.fromI32(i), BigInt.fromI32(i + 100));

        assert.stringEquals(hashTable.get(Bytes.fromI32(i)).toString(), BigInt.fromI32(i + 100).toString());
      }
    });

    test("should resize", () => {
      const oldKeys = hashTable.getKeys();
      const oldValues = hashTable.getValues();
      const oldActiveKeysCount = hashTable.getActiveKeysCount();

      hashTable.set(Bytes.fromI32(8), BigInt.fromI32(8 + 100));

      const newKeys = hashTable.getKeys();
      const newValues = hashTable.getValues();
      const newActiveKeysCount = hashTable.getActiveKeysCount();

      assert.stringEquals((oldKeys.length * 2).toString(), newKeys.length.toString());
      assert.stringEquals((oldValues.length * 2).toString(), newValues.length.toString());
      assert.stringEquals((oldActiveKeysCount + 1).toString(), newActiveKeysCount.toString());

      for (let i = 0; i < oldKeys.length; i++) {
        assert.stringEquals(hashTable.get(oldKeys[i]).toString(), oldValues[i].toString());
      }

      assert.stringEquals(hashTable.get(Bytes.fromI32(7)).toString(), BigInt.fromI32(7 + 100).toString());

      for (let i = oldKeys.length; i < newKeys.length; i++) {
        assert.stringEquals(newKeys[i].toHexString(), instantiate<Bytes>(0).toHexString());
      }
    });

    test("should resize to 40", () => {
      hashTable.set(Bytes.fromI32(8), BigInt.fromI32(8 + 100));
      for (let i = hashTable.getActiveKeysCount(); hashTable.getLoadFactor() < HashTable.MAX_LOAD_FACTOR; i++) {
        hashTable.set(Bytes.fromI32(i), BigInt.fromI32(i + 100));

        assert.stringEquals(hashTable.get(Bytes.fromI32(i)).toString(), BigInt.fromI32(i + 100).toString());
      }

      const oldKeys = hashTable.getKeys();
      const oldValues = hashTable.getValues();
      const oldActiveKeysCount = hashTable.getActiveKeysCount();

      hashTable.set(Bytes.fromI32(19), BigInt.fromI32(19 + 100));

      const newKeys = hashTable.getKeys();
      const newValues = hashTable.getValues();
      const newActiveKeysCount = hashTable.getActiveKeysCount();

      assert.stringEquals((oldKeys.length * 2).toString(), newKeys.length.toString());
      assert.stringEquals((oldValues.length * 2).toString(), newValues.length.toString());
      assert.stringEquals((oldActiveKeysCount + 1).toString(), newActiveKeysCount.toString());

      for (let i = 0; i < oldKeys.length; i++) {
        assert.stringEquals(hashTable.get(oldKeys[i]).toString(), oldValues[i].toString());
      }

      for (let i = oldKeys.length; i < newKeys.length; i++) {
        assert.stringEquals(newKeys[i].toHexString(), instantiate<Bytes>(0).toHexString());
      }
    });
  });
});
