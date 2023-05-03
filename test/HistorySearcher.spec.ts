import { Entity } from "@graphprotocol/graph-ts";
import { findPrevHistory } from "../modules/HistorySearcher";
import { BigInt } from "@graphprotocol/graph-ts";

const storeMap = new Map<string, MockEntity>();

class MockEntity extends Entity {
    id: string;

    constructor(id: string) {
        super()
        this.id = id;
    }

    static load(id: string): MockEntity | null {
        let entity = storeMap.get(id);
        return typeof entity === 'undefined' ? null : entity;
    }

    save(): void {
        storeMap.set(this.id, this);
    };
}

describe("HistorySearcher", () => {
    const idBase = "entityid";
    
    beforeAll(() => {
        (new MockEntity(idBase+"1")).save();
        (new MockEntity(idBase+"2")).save();
        (new MockEntity(idBase+"3")).save();
        (new MockEntity(idBase+"10")).save();
    });

    describe("findPrevHistory", () => {
        it("should find prev history", () => {
            let currentSuffix = BigInt.fromI32(2);
            let decrement = BigInt.fromI32(1);

            let prevEntity = findPrevHistory<MockEntity>(MockEntity.load, idBase, currentSuffix, decrement, 1);

            expect<MockEntity|null>(prevEntity).not.toBeNull();

            if (prevEntity != null)
                expect(prevEntity.id).toStrictEqual(idBase+"1");
        });
    });
});