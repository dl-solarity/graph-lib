import { Entity, Value, store, BigInt } from "@graphprotocol/graph-ts";

export class EpnsNotificationCounter extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");

    if (id) {
      store.set("EpnsNotificationCounter", id.toString(), this);
    }
  }

  static load(id: string): EpnsNotificationCounter | null {
    return changetype<EpnsNotificationCounter | null>(store.get("EpnsNotificationCounter", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get totalCount(): BigInt {
    let value = this.get("totalCount");
    return value!.toBigInt();
  }

  set totalCount(value: BigInt) {
    this.set("totalCount", Value.fromBigInt(value));
  }
}

export class EpnsPushNotification extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");

    if (id) {
      store.set("EpnsPushNotification", id.toString(), this);
    }
  }

  static load(id: string): EpnsPushNotification | null {
    return changetype<EpnsPushNotification | null>(store.get("EpnsPushNotification", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get recipient(): string {
    let value = this.get("recipient");
    return value!.toString();
  }

  set recipient(value: string) {
    this.set("recipient", Value.fromString(value));
  }

  get notification(): string {
    let value = this.get("notification");
    return value!.toString();
  }

  set notification(value: string) {
    this.set("notification", Value.fromString(value));
  }

  get notificationNumber(): BigInt {
    let value = this.get("notificationNumber");
    return value!.toBigInt();
  }

  set notificationNumber(value: BigInt) {
    this.set("notificationNumber", Value.fromBigInt(value));
  }
}
