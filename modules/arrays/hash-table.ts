import { BigInt, ByteArray } from "@graphprotocol/graph-ts";
import { isBytesArray } from "../utils/type-utils";

export class HashTable<K extends object, V> {
  public static readonly MAX_LOAD_FACTOR: f64 = 0.7;

  private keys: Array<K>;
  private values: Array<V>;
  private activeKeysCount: i32;

  constructor(keys: Array<K>, values: Array<V>, activeKeysCount: i32) {
    assert(keys.length == values.length, "Array lengths must be the same");
    assert(keys.length >= activeKeysCount, "ActiveKeysCount must be lower of equal keys.length");

    this.keys = keys;
    this.values = values;
    this.activeKeysCount = activeKeysCount;

    if (this.keys.length == 0) {
      this.resize(10);
    }
  }

  public get(key: K): V {
    const index = this.getHash(key, this.keys.length);

    for (let i = index; i < this.keys.length; i++) {
      if (this.keys[i] == key) {
        return this.values[i];
      }
    }

    for (let i = 0; i < index; i++) {
      if (this.keys[i] == key) {
        return this.values[i];
      }
    }

    throw new Error("Key not found");
  }

  public set(key: K, value: V): void {
    if (HashTable.MAX_LOAD_FACTOR <= this.getLoadFactor()) {
      this.resizeAndRehash();
    }

    const index = this.getHash(key, this.keys.length);

    if (this.keys[index] == key) {
      this.values[index] = value;
    } else {
      for (let i = index; i < this.keys.length; i++) {
        if (this.keys[i] == instantiate<K>(0)) {
          this.keys[i] = key;
          this.values[i] = value;
          this.activeKeysCount++;

          return;
        }
      }

      for (let i = 0; i < index; i++) {
        if (this.keys[i] == instantiate<K>(0)) {
          this.keys[i] = key;
          this.values[i] = value;
          this.activeKeysCount++;

          return;
        }
      }
    }
  }

  public includes(key: K): boolean {
    return this.keys.includes(key);
  }

  public getKeys(): Array<K> {
    return this.keys;
  }

  public getValues(): Array<V> {
    return this.values;
  }

  public getLoadFactor(): f64 {
    return this.activeKeysCount / F64.parseFloat(this.keys.length.toString());
  }

  public getActiveKeysCount(): i32 {
    return this.activeKeysCount;
  }

  public getHash(key: K, length: i32): i32 {
    let hash: BigInt = BigInt.zero();

    if (isBytesArray(key)) {
      hash = BigInt.fromUnsignedBytes(changetype<ByteArray>(key));
    } else {
      const str = key.toString();
      let summ: i32;
      for (let i = 0; i < str.length; i++) {
        summ += str.charCodeAt(i);
      }
      hash = BigInt.fromI32(summ);
    }

    return hash.mod(BigInt.fromI32(length)).toI32();
  }

  private resize(newLength: i32): void {
    this.keys = new Array<K>(newLength).fill(instantiate<K>(0));
    this.values = new Array<V>(newLength).fill(instantiate<V>(0));
  }

  private rehash(oldKeys: Array<K>, oldValues: Array<V>): void {
    for (let i = 0; i < oldKeys.length; i++) {
      if (oldKeys[i] != instantiate<K>(0)) {
        this.set(oldKeys[i], oldValues[i]);
      }
    }
  }

  private resizeAndRehash(): void {
    const oldKeys = this.keys;
    const oldValues = this.values;

    this.activeKeysCount = 0;

    this.resize(oldKeys.length * 2);
    this.rehash(oldKeys, oldValues);
  }
}
