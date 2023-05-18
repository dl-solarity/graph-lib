import { assert, describe, test } from "matchstick-as";
import { isAddress, isBytes, isBytesArray } from "../../modules/utils/type-utils";
import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";

describe("type-utisl", () => {
  describe("isBytesArray", () => {
    test("should return true when args are BytesArray, Bytes, Address", () => {
      assert.assertTrue(isBytesArray(new ByteArray(1)));
      assert.assertTrue(isBytesArray(new Bytes(1)));
      assert.assertTrue(isBytesArray(Address.zero()));
    });

    test("should return false when args are BigInt, string", () => {
      assert.assertTrue(!isBytesArray(BigInt.zero()));
      assert.assertTrue(!isBytesArray(""));
    });
  });

  describe("isBytes", () => {
    test("should return true when args are Bytes, Address", () => {
      assert.assertTrue(isBytes(new Bytes(1)));
      assert.assertTrue(isBytes(Address.zero()));
    });

    test("should return false when args are BytesArray, BigInt, string", () => {
      assert.assertTrue(!isBytes(new ByteArray(1)));
      assert.assertTrue(!isBytes(BigInt.zero()));
      assert.assertTrue(!isBytes(""));
    });
  });

  describe("isAddress", () => {
    test("should return true when arg is Address", () => {
      assert.assertTrue(isAddress(Address.zero()));
    });

    test("should return false when args are BytesArray, Bytes, BigInt, string", () => {
      assert.assertTrue(!isAddress(new ByteArray(1)));
      assert.assertTrue(!isAddress(new Bytes(1)));
      assert.assertTrue(!isAddress(BigInt.zero()));
      assert.assertTrue(!isAddress(""));
    });
  });
});
