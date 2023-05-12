export class BoundedArrays<K, V> {
  private keys: Array<K>;
  private values: Array<V>;

  constructor(keys: Array<K>, values: Array<V>) {
    assert(keys.length == values.length, "Array lengths must be the same");
    this.keys = keys;
    this.values = values;
  }

  public get(key: K): V {
    const index = this.keys.indexOf(key);

    if (index != -1) {
      return this.values[index];
    }

    throw new Error("Key not found");
  }

  public set(key: K, value: V): void {
    const index = this.keys.indexOf(key);

    if (index != -1) {
      this.values[index] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
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
}
