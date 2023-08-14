import { Address, ByteArray, Bytes } from "@graphprotocol/graph-ts";

export function isBytesArray<T>(value: T): boolean {
  return value instanceof ByteArray;
}

export function isBytes<T>(value: T): boolean {
  return value instanceof Bytes;
}

export function isAddress<T>(value: T): boolean {
  return value instanceof Address;
}
