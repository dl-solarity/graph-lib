import { Entity, Value, store } from "@graphprotocol/graph-ts";

export class MockEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");

    if (id) {
      store.set("MockEntity", id.toString(), this);
    }
  }

  static load(id: string): MockEntity | null {
    return changetype<MockEntity | null>(store.get("MockEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}
