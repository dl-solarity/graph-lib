import { assert, beforeEach, describe, test } from "matchstick-as";
import { HashTable } from "../../lib";
import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";

let hashTable: HashTable<Bytes, BigInt>;

describe("hash-table", () => {
  beforeEach(() => {
    hashTable = new HashTable<Bytes, BigInt>([], [], 0, instantiate<Bytes>(0), instantiate<BigInt>(0));
  });

  describe("constructor", () => {
    test(
      "should fail when array lengths are not equal",
      () => {
        new HashTable<ByteArray, BigInt>(
          [Bytes.fromBigInt(BigInt.fromI32(1)), Bytes.fromBigInt(BigInt.fromI32(2))],
          [BigInt.fromI32(3)],
          2,
          instantiate<Bytes>(0),
          instantiate<BigInt>(0),
        );
      },
      true,
    );

    test(
      "should fail when key array length less then activeKeysCount",
      () => {
        new HashTable<ByteArray, BigInt>(
          [Bytes.fromBigInt(BigInt.fromI32(1)), Bytes.fromBigInt(BigInt.fromI32(2))],
          [BigInt.fromI32(1), BigInt.fromI32(2)],
          5,
          instantiate<Bytes>(0),
          instantiate<BigInt>(0),
        );
      },
      true,
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
      hashTable.set(Bytes.fromI32(2), BigInt.fromI32(2));

      const newKey = Bytes.fromI32(3);
      const newValue = BigInt.fromI32(3);
      const activeKeysCount = hashTable.getActiveKeysCount();

      hashTable.set(newKey, newValue);

      const keys = hashTable.getKeys();

      assert.stringEquals(hashTable.get(newKey).toString(), newValue.toString());
      assert.stringEquals(hashTable.getActiveKeysCount().toString(), (activeKeysCount + 1).toString());

      assert.stringEquals(hashTable.getHash(newKey, hashTable.getKeys().length).toString(), "3");
      assert.stringEquals(keys.indexOf(newKey).toString(), "4");
    });

    test("should add new value, with collision and overflow", () => {
      const newKey = Bytes.fromI32(19);
      const newValue = BigInt.fromI32(19);

      hashTable.set(Bytes.fromI32(6), BigInt.fromI32(6));
      assert.stringEquals(hashTable.get(Bytes.fromI32(6)).toString(), BigInt.fromI32(6).toString());

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
      const newHashTable = new HashTable<BigInt, BigInt>([], [], 0, instantiate<BigInt>(0), instantiate<BigInt>(0));
      newHashTable.set(BigInt.fromI32(4), BigInt.fromI32(4));

      assert.stringEquals(newHashTable.get(BigInt.fromI32(4)).toString(), BigInt.fromI32(4).toString());
    });

    test("should correctly set, when key is string", () => {
      const newHashTable = new HashTable<String, BigInt>([], [], 0, instantiate<String>(), instantiate<BigInt>(0));
      newHashTable.set("hello", BigInt.fromI32(4));

      assert.stringEquals(newHashTable.get("hello").toString(), BigInt.fromI32(4).toString());
    });

    test("should correctly set empty value", () => {
      hashTable.set(Bytes.fromI32(50), instantiate<BigInt>(0));

      assert.stringEquals(hashTable.get(Bytes.fromI32(50)).toString(), instantiate<BigInt>(0).toString());
    });

    test(
      "should fail when key is empty",
      () => {
        hashTable.set(instantiate<Bytes>(0), instantiate<BigInt>(0));
      },
      true,
    );
  });

  describe("get()", () => {
    test(
      "should throw Key not found",
      () => {
        const key = Bytes.fromI32(50);

        hashTable.get(key);
      },
      true,
    );

    test(
      "should throw Key is empty",
      () => {
        hashTable.get(instantiate<Bytes>(0));
      },
      true,
    );
  });

  describe("resizeAndRehash()", () => {
    beforeEach(() => {
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
        assert.assertTrue(newKeys.includes(oldKeys[i]));
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
        assert.assertTrue(newKeys.includes(oldKeys[i]));
      }
    });

    test("should add 1000 elements", () => {
      for (let i = 0; i < 1000; i++) {
        hashTable.set(Bytes.fromI32(i), BigInt.fromI32(i));
      }

      for (let i = 0; i < 1000; i++) {
        assert.stringEquals(hashTable.get(Bytes.fromI32(i)).toString(), BigInt.fromI32(i).toString());
      }
    });
  });
});
