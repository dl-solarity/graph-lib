import { BigInt } from "@graphprotocol/graph-ts";

export function findPrevHistory<T>(
  loadFunction: (id: string) => T | null,
  idBase: string,
  idSuffix: BigInt,
  decrement: BigInt,
  maxSearchDepth: i32,
  minimum: BigInt = BigInt.zero(),
): T | null {
  let newSuffix = idSuffix.minus(decrement);
  let history = loadFunction(idBase + newSuffix.toString());

  while (
    history == null &&
    newSuffix.gt(minimum) &&
    idSuffix.minus(newSuffix).div(decrement).le(BigInt.fromI32(maxSearchDepth))
  ) {
    newSuffix = newSuffix.minus(decrement);
    history = loadFunction(idBase + newSuffix.toString());
  }

  return history;
}
