import { ByteArray } from "@graphprotocol/graph-ts";

export class HashTable<K extends object, V> {
  public static readonly MAX_LOAD_FACTOR = 0.7;

  private keys: Array<K>;
  private values: Array<V>;
  private activeKeysCount: number;

  constructor(keys: Array<K>, values: Array<V>, activeKeysCount: number) {
    assert(keys.length == values.length, "Array lengths must be the same");
    assert(keys.length >= activeKeysCount, "ActiveKeysCount must be lower of equal keys.length");
    this.keys = keys;
    this.values = values;
    this.activeKeysCount = activeKeysCount;
  }

  public get(key: K): V {
    const index = this.getHash(key, this.keys.length);

    for (let i = index; i < this.keys.length; i++) {
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
        if (!this.keys[i]) {
          this.keys[i] = key;
          this.values[i] = value;
          this.activeKeysCount++;

          break;
        }
      }

      for (let i = 0; i < index; i++) {
        if (!this.keys[i]) {
          this.keys[i] = key;
          this.values[i] = value;
          this.activeKeysCount++;

          break;
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

  public getLoadFactor(): number {
    return this.activeKeysCount / this.keys.length;
  }

  public getHash(key: K, length: number): number {
    let hash = 0;

    if (isBytesArray(key)) {
      hash = key.toU64();
    } else {
      const str = key.toString();
      for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
      }
    }

    return hash % length;
  }

  private resize(): void {
    this.keys = new Array<K>(this.keys.length * 2);
    this.values = new Array<V>(this.values.length * 2);
  }

  private rehash(oldKeys: Array<K>, oldValues: Array<V>): void {
    for (let i = 0; i < oldKeys.length; i++) {
      this.set(oldKeys[i], oldValues[i]);
    }
  }

  private resizeAndRehash(): void {
    const oldKeys = this.keys;
    const oldValues = this.values;

    this.resize();
    this.rehash(oldKeys, oldValues);
  }
}

export function isBytesArray(object: unknown): object is ByteArray {
  return object instanceof ByteArray;
}
