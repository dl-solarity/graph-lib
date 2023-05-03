import { describe, assert, beforeAll, test } from "matchstick-as";
import { Entity, BigInt } from "@graphprotocol/graph-ts";
import { findPrevHistory } from "../../modules/utils/history-searcher";

const storeMap = new Map<string, MockEntity>();

class MockEntity extends Entity {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  static load(id: string): MockEntity | null {
    let entity = storeMap.get(id);
    return typeof entity === "undefined" ? null : entity;
  }

  save(): void {
    storeMap.set(this.id, this);
  }
}

describe("history-searcher", () => {
  const idBase = "entityid";

  beforeAll(() => {
    new MockEntity(idBase + "1").save();
    new MockEntity(idBase + "2").save();
    new MockEntity(idBase + "3").save();
    new MockEntity(idBase + "10").save();
  });

  describe("findPrevHistory", () => {
    const idBase = "entityid";

    test("should find prev history", () => {
      let currentSuffix = BigInt.fromI32(2);
      let decrement = BigInt.fromI32(1);

      let prevEntity = findPrevHistory<MockEntity>(MockEntity.load, idBase, currentSuffix, decrement, 1);

      assert.assertNotNull(prevEntity);
      assert.stringEquals(prevEntity!.id, idBase + "1");
    });
  });
});
