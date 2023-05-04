import { describe, assert, beforeAll, test } from "matchstick-as";
import { BigInt } from "@graphprotocol/graph-ts";
import { findPrevHistory } from "../../modules/";
import { MockEntity } from "../mocks/MockEntity";

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

    test("should find prev history when starting suffix = 10", () => {
      let currentSuffix = BigInt.fromI32(10);
      let decrement = BigInt.fromI32(1);

      let prevEntity = findPrevHistory<MockEntity>(MockEntity.load, idBase, currentSuffix, decrement, 100);

      assert.assertNotNull(prevEntity);
      assert.stringEquals(prevEntity!.id, idBase + "3");
    });

    test("should not find anything", () => {
      let currentSuffix = BigInt.fromI32(1);
      let decrement = BigInt.fromI32(1);

      let prevEntity = findPrevHistory<MockEntity>(MockEntity.load, idBase, currentSuffix, decrement, 100);

      assert.assertNull(prevEntity);
    });
  });
});
