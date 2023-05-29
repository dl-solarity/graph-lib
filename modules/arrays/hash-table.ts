import { BigInt } from "@graphprotocol/graph-ts";

export class HashTable<K extends object, V> {
  public static readonly MAX_LOAD_FACTOR: f64 = 0.7;

  private keys: Array<K>;
  private values: Array<V>;
  private activeKeysCount: i32;
  private zeroKey: K;
  private zeroValue: V;

  constructor(keys: Array<K>, values: Array<V>, activeKeysCount: i32, zeroKey: K, zeroValue: V) {
    assert(keys.length == values.length, "Array lengths must be the same");
    assert(keys.length >= activeKeysCount, "ActiveKeysCount must be lower of equal keys.length");

    this.keys = keys;
    this.values = values;
    this.activeKeysCount = activeKeysCount;

    this.zeroKey = zeroKey;
    this.zeroValue = zeroValue;

    if (this.keys.length == 0) {
      this.resize(10);
    }
  }

  public get(key: K): V {
    if (key == this.zeroKey) {
      throw new Error("Key is empty");
    }

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
    if (key == this.zeroKey) {
      throw new Error("Key is empty");
    }

    if (HashTable.MAX_LOAD_FACTOR <= this.getLoadFactor()) {
      this.resizeAndRehash();
    }

    const index = this.getHash(key, this.keys.length);

    if (this.keys[index] == key) {
      this.values[index] = value;
    } else {
      for (let i = index; i < this.keys.length; i++) {
        if (this.keys[i] == this.zeroKey) {
          this.keys[i] = key;
          this.values[i] = value;
          this.activeKeysCount++;

          return;
        }
      }

      for (let i = 0; i < index; i++) {
        if (this.keys[i] == this.zeroKey) {
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

  public getHash(data: K, length: i32): i32 {
    let hash: u32 = 0;

    for (let i: i32 = 0; i < data.length; i++) {
      hash += data instanceof String ? data.charCodeAt(i) : data[i];
      hash += hash << 10;
      hash ^= hash >> 6;
    }

    hash += hash << 3;
    hash ^= hash >> 11;
    hash += hash << 15;

    return BigInt.fromU32(hash).mod(BigInt.fromI32(length)).toI32();
  }

  private resize(newLength: i32): void {
    this.keys = new Array<K>(newLength).fill(this.zeroKey);
    this.values = new Array<V>(newLength).fill(this.zeroValue);
  }

  private rehash(oldKeys: Array<K>, oldValues: Array<V>): void {
    for (let i = 0; i < oldKeys.length; i++) {
      if (oldKeys[i] != this.zeroKey) {
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
